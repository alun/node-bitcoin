var commands = require('./commands')
var rpc = require('./jsonrpc')
var Future = require('./promise-future')

// ===----------------------------------------------------------------------===//
// Client
// ===----------------------------------------------------------------------===//
function Client (opts) {
  this.rpc = new rpc.Client(opts)
}

// ===----------------------------------------------------------------------===//
// cmd
// ===----------------------------------------------------------------------===//
Client.prototype.cmd = function () {
  var args = [].slice.call(arguments)
  var cmd = args.shift()

  callRpc(cmd, args, this.rpc)
}

// ===----------------------------------------------------------------------===//
// callRpc
// ===----------------------------------------------------------------------===//
function callRpc (cmd, args, rpc) {

  var future = new Future
  rpc.call(cmd, args, function () {
    var args = [].slice.call(arguments)
    args.unshift(null)
    future.resolve(args)
  }, function (err) {
    future.reject(err)
  })
  return future.promise

}

// ===----------------------------------------------------------------------===//
// Initialize wrappers
// ===----------------------------------------------------------------------===//
(function () {
  for (var protoFn in commands) {
    (function (protoFn) {
      Client.prototype[protoFn] = function () {
        var args = [].slice.call(arguments)
        return callRpc(commands[protoFn], args, this.rpc)
      }
    })(protoFn)
  }
})()

// Export!
module.exports.Client = Client
