 var app = require("../app");
 var http = require('http');
 var bodyParser = require('body-parser');

 var server = http.createServer(app);

 app.set('port', process.env.PORT || '3000');
 server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log(`Image Search API listening at ${addr.address}: ${addr.port}`);
});