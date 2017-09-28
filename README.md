# grenache-nodejs-proxy

proxy to bridge client and service using different protocols

1. run two grapes
   
   grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
   
   grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
   
2. run 'node rpc_ws_server_coffee.js' and 'node rpc_ws_server_tea.js' from examples directory
3. run 'node rpc_proxy.js' from examples directory
4. run 'node rpc_http_client.js' from examples directory

#### Example

```javascript
'use strict'

const Grenache = require('./../')
const GrLink = require('grenache-nodejs-link')
const PeerRPCProxy = Grenache.PeerRPCProxy

const _ = require('lodash')

const link = new GrLink({
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
```