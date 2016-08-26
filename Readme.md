# node-bitcoin
[![js-standard-style][standard-image]][standard-url]

[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat
[standard-url]: http://standardjs.com

node-bitcoin is a simple wrapper for the Bitcoin client's JSON-RPC API.

This fork modifies original bitcoin API response to convert amount to strings as by default they are number and real value could be lost due to precision issues. Having them as strings it becames possible to convert them into some variant of BigDecimal to do arithmetical operations without precisionlost

The API is equivalent to the API document [here](https://en.bitcoin.it/wiki/Original_Bitcoin_client/API_Calls_list).
The methods are exposed as lower camelcase methods on the `bitcoin.Client`
object, or you may call the API directly using the `cmd` method.

## Examples

### Create client
```js
// all config options are optional
var client = new bitcoin.Client({
  host: 'localhost',
  port: 8332,
  user: 'username',
  pass: 'password',
  timeout: 30000
});
```

### Get balance across all accounts with minimum confirmations of 6

```js
client.getBalance('*', 6).then(args => {
  let [balance, resHeaders] = args
  console.log('Balance:', balance)
}).catch(err => {
  console.log(err)
})
```
### Getting the balance directly using `cmd`

```js
client.cmd('getbalance', '*', 6).then(args => {
  let [balance, resHeaders] = args
  console.log('Balance:', balance)
}).catch(err => console.log(err))
```

### Batch multiple RPC calls into single HTTP request

```js
var batch = [];
for (var i = 0; i < 10; ++i) {
  batch.push({
    method: 'getnewaddress',
    params: ['myaccount']
  });
}
client.cmd(batch)
  .catch(err => console.log(err))
  .then(address => console.log(address))
});
```

## SSL
See [Enabling SSL on original client](https://en.bitcoin.it/wiki/Enabling_SSL_on_original_client_daemon).

If you're using this to connect to bitcoind across a network it is highly
recommended to enable `ssl`, otherwise an attacker may intercept your RPC credentials
resulting in theft of your bitcoins.

When enabling `ssl` by setting the configuration option to `true`, the `sslStrict`
option (verifies the server certificate) will also be enabled by default. It is
highly recommended to specify the `sslCa` as well, even if your bitcoind has
a certificate signed by an actual CA, to ensure you are connecting
to your own bitcoind.

```js
var client = new bitcoin.Client({
  host: 'localhost',
  port: 8332,
  user: 'username',
  pass: 'password',
  ssl: true,
  sslStrict: true,
  sslCa: fs.readFileSync(__dirname + '/myca.cert')
});
```
