'use strict'

const GrWs = require('grenache-nodejs-ws')
const GrLink = require('grenache-nodejs-link')
const Peer = GrWs.PeerRPCClient

const link = new GrLink({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new Peer(link, {})
peer.init()

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

sleep(1000).then(() => {
  peer.request('rpc_proxy', 'http:coffee', {timeout: 10000}, (err, data) => {
    if (err) {
      console.error(err)
      process.exit(-1)
    }
    console.log(err, data)
  })
  return sleep(1000)
}).then(() => {
  peer.request('rpc_proxy', 'http:tea', {timeout: 10000}, (err, data) => {
    if (err) {
      console.error(err)
      process.exit(-1)
    }
    console.log(err, data)
  })
  return sleep(1000)
}).then(() => {
  peer.request('http:coffee', 'Hello', {timeout: 10000}, (err, data) => {
    if (err) {
      console.error(err)
      process.exit(-1)
    }
    console.log(err, data)
  })
  return sleep(1000)
}).then(() => {
  peer.request('http:tea', 'Hello', {timeout: 10000}, (err, data) => {
    if (err) {
      console.error(err)
      process.exit(-1)
    }
    console.log(err, data)
  })
  return sleep(1000)
}).then(() => {
  peer.request('rpc_proxy', 'stop http:tea', {timeout: 10000}, (err, data) => {
    if (err) {
      console.error(err)
      process.exit(-1)
    }
    console.log(err, data)
  })
  return sleep(1000)
}).then(() => {
  peer.request('http:tea', 'Hello', {timeout: 10000}, (err, data) => {
    if (err) {
      console.error(err)
      process.exit(-1)
    }
    console.log(err, data)
  })
})
