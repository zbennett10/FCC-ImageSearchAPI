var http = require('http');
var express = require('express');

var app = express();
var server = http.createServer(app);


//set view engine
app.set('view engine', 'pug');

//middleware----------
//serve static files from this directory
app.use(express.static(__dirname + '/public'));

//handle 404
app.use(function(req,res) {
  res.send('404: Page Not Found', 404);
});

//handle 500
app.use(function(req,res) {
  res.send('500: Internal Server Error', 500);
});

//configure routes
var indexRoute = require('./routes/index');
var apiRoute = require('./routes/api');

app.use('/', indexRoute);
app.use('/', apiRoute);



server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log(`Image Search API listening at ${addr.address}: ${addr.port}`);
});