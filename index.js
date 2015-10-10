var app = require('app');
var BrowserWindow = require('browser-window');

mainWindow = null;

app.on('ready', function() {

  var mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  mainWindow.loadUrl('file://' + __dirname + '/client/views/index.html');
  mainWindow.openDevTools();

  mainWindow.on('closed', function() {
    console.log('Window closed');
    mainWindow = null;
  });
});
