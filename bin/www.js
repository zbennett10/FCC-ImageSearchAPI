// var app = require("../app");
// var http = require('http');
// var bodyParser = require('body-parser');

// var port = normalizePort(process.env.PORT || '3000');
// app.set('port', port);

// var server = http.createServer(app);
// server.listen(port);



// function normalizePort(val) {
//   var port = parseInt(val, 10);

//   if (isNaN(port)) {
//     // named pipe
//     return val;
//   }

//   if (port >= 0) {
//     // port number
//     return port;
//   }

//   return false;
// }

var http = require('http');
var express = require('express');

var app = express();
var server = http.createServer(app);


//set view engine
app.set('view engine', 'pug');

//middleware----------
//serve static files from this directory
// app.use('/assets', express.static(__dirname + '/public'));

//configure routes
var indexRoute = require('../routes/index');
var apiRoute = require('../routes/api');

app.use('/', indexRoute);
app.use('/', apiRoute);


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log(`Image Search API listening at ${addr.address}: ${addr.port}`);
});
