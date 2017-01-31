var express = require('express');
var router = express();

router.get('/', function(req, res) {
    res.render('../views/index.pug', {title: 'Image Search API'});
});

module.exports = router;