'use strict'

const Base = require('grenache-nodejs-base')
const GrWs = require('grenache-nodejs-ws')
const GrHttp = require('grenache-nodejs-http')

class StatefulPeerRPCProxy extends Base.PeerRPCServer {
  constructor (link, conf = {}) {
    super(link, conf)
    this.proxiedServices = new Map()
  }

  init () {
    super.init()
    switch (this.conf.proxyType.toLowerCase()) {
      case 'ws':
        this.server = new GrWs.PeerRPCServer(this.link, this.conf)
        break
      case 'http':
        this.server = new GrHttp.PeerRPCServer(this.link, this.conf)
        break
      default:
        throw new Error('Unsupported proxy type: ' + this.conf.proxyType)
    }
    this.server.init()
  }

  transport (dest, opts = {}) {
    let t = this.server.transport(dest, opts)
    t.on('request', (rid, key, payload, handler) => {
      if (payload) {
        if (payload.startsWith('ws:') || payload.startsWith('http:')) {
          let link = this.link
          let announcement = setInterval(function () {
            link.announce(payload, t.port, {})
          }, 1000)
          this.proxiedServices.set(payload, announcement)
          handler.reply(null, 'Started proxying ' + payload)
        } else if (payload.startsWith('stop ')) {
          let proxiedService = payload.substr('stop '.length)
          clearInterval(this.proxiedServices.get(proxiedService))
          this.proxiedServices.delete(proxiedService)
          handler.reply(null, 'Stopped proxying ' + proxiedService)
        } else if (this.proxiedServices.get(key)) {
          let client, proxiedService
          if (key.startsWith('ws:')) {
            client = new GrWs.PeerRPCClient(this.link, {})
            proxiedService = key.substr('ws:'.length)
          } else if (key.startsWith('http:')) {
            client = new GrHttp.PeerRPCClient(this.link, {})
            proxiedService = key.substr('http:'.length)
          }
          client.init()
          client.request(proxiedService, payload, { timeout: 10000 }, (err, data) => {
            console.log('Response from ', proxiedService, err, data)
            handler.reply(err, data)
          })
        } else {
          handler.reply(new Error(key + ' is not proxied'), null)
        }
      }
    })
    return t
  }
}

module.exports = StatefulPeerRPCProxy
