var express = require('express');
var router = express();

router.get('/', function(req, res) {
    res.send('<html><head><link href=assets/index.css type=text/css rel=stylesheet></head><body><h1>Hello World!</h1></body></html>');
});

module.exports = router;