'use strict'

const Http = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const Peer = Http.PeerRPCClient

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new Peer(link, {})
peer.init()

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

sleep(1000).then(() => {
  peer.request('rpc_proxy', 'ws:coffee', {timeout: 10000}, (err, data) => {
    if (err) {
      console.error(err)
      process.exit(-1)
    }
    console.log(err, data)
  })
  return sleep(1000)
}).then(() => {
  peer.request('rpc_proxy', 'ws:tea', {timeout: 10000}, (err, data) => {
    if (err) {
      console.error(err)
      process.exit(-1)
    }
    console.log(err, data)
  })
  return sleep(1000)
}).then(() => {
  peer.request('ws:coffee', 'Hello', {timeout: 10000}, (err, data) => {
    if (err) {
      console.error(err)
      process.exit(-1)
    }
    console.log(err, data)
  })
  return sleep(1000)
}).then(() => {
  peer.request('ws:tea', 'Hello', {timeout: 10000}, (err, data) => {
    if (err) {
      console.error(err)
      process.exit(-1)
    }
    console.log(err, data)
  })
  return sleep(1000)
}).then(() => {
  peer.request('rpc_proxy', 'stop ws:tea', {timeout: 10000}, (err, data) => {
    if (err) {
      console.error(err)
      process.exit(-1)
    }
    console.log(err, data)
  })
  return sleep(1000)
}).then(() => {
  peer.request('ws:tea', 'Hello', {timeout: 10000}, (err, data) => {
    if (err) {
      console.error(err)
      process.exit(-1)
    }
    console.log(err, data)
  })
})

