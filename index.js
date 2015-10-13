var app = require('app');

var request = require('request');
var BrowserWindow = require('browser-window');

// In main process.
var ipc = require('ipc');
ipc.on('asynchronous-message', function(event, arg) {
  console.log(arg); // prints "ping"
  event.sender.send('asynchronous-reply', 'pong');
});

mainWindow = null;

app.on('ready', function() {

  request('http://localhost:3000/hello', function(err, res, body){
    console.log('hello');
  })

  var opts = {};

  var mainWindow = new BrowserWindow(opts);
  mainWindow.maximize();

  mainWindow.loadUrl('file://' + __dirname + '/client/views/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
