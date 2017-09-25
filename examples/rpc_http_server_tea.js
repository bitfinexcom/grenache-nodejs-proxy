'use strict'

const Http = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const Peer = Http.PeerRPCServer

const _ = require('lodash')

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new Peer(link, {
  timeout: 300000
})
peer.init()

const service = peer.transport('server')
service.listen(_.random(1000) + 1024)

setInterval(function () {
  link.announce('tea', service.port, {})
}, 1000)

service.on('request', (rid, key, payload, handler) => {
  console.log('peer', rid, key, payload)
  handler.reply(null, key + ' world')
  // handler.reply(new Error('something went wrong'), 'world')
})
