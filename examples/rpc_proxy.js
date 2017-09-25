'use strict'

const Grenache = require('./../')
const Link = require('grenache-nodejs-link')
const PeerRPCProxy = Grenache.PeerRPCProxy

const _ = require('lodash')

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

// const peer = new PeerRPCProxy(link, {proxyType: 'ws'})
const peer = new PeerRPCProxy(link, {proxyType: 'http'})
peer.init()

const service = peer.transport('server')
service.listen(_.random(1000) + 1024)

setInterval(function () {
  link.announce('rpc_proxy', service.port, {})
}, 1000)
