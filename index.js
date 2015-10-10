var app = require('app');
var BrowserWindow = require('browser-window');

mainWindow = null;

app.on('ready', function() {

  var opts = {};
  
  var mainWindow = new BrowserWindow(opts);
  mainWindow.maximize();

  mainWindow.loadUrl('file://' + __dirname + '/client/views/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
