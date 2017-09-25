# grenache-nodejs-proxy

proxy to bridge client and service using different protocols

1. run two grapes
   
   grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
   
   grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
   
2. run 'node rpc_ws_server_coffee.js' and 'node rpc_ws_server_tea.js' from examples directory
3. run 'node rpc_proxy.js' from examples directory
4. run 'node rpc_http_client.js' from examples directory
