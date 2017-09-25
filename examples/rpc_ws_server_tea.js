'use strict'

const Ws = require('grenache-nodejs-ws')
const Link = require('grenache-nodejs-link')
const PeerRPCServer = Ws.PeerRPCServer

const _ = require('lodash')

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCServer(link, {})
peer.init()

const service = peer.transport('proxy')
service.listen(_.random(1000) + 1024)

setInterval(function () {
  link.announce('tea', service.port, {})
}, 1000)

service.on('request', (rid, key, payload, handler) => {
  console.log('peer', rid, key, payload)
  // handler.reply(new Error('something went wrong'), 'world')
  handler.reply(null, key + ' world')
})
