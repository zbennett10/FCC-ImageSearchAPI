var express = require('express');
var mongoose = require('mongoose');
var moment = require('moment');
var request = require('request');
var router = express();
var Search = require('../models/search.js');

//search endpoint
router.get('/api/search/:searchStr', function(req, res, next) {
    if(req.query.offset && (/^\d+$/g).test(req.query.offset)) {     //check if an offset was requested
        getImagesOffset(req,res);
    } else {
        getImages(req,res);
    } 
});

//history endpoint
router.get('/api/history', function(req,res) {
    getHistory(res);
});

//store search
function saveSearch(search) {
    mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASS}@ds137759.mlab.com:37759/freecodecamp`);
    var searchDocument = Search({
        searchTerm: search,
        timestamp: moment().unix()
    });
    searchDocument.save(function(err, searches) {
       if(err) throw err;
       console.log('Saved Search!');
    });
    mongoose.connection.close();
}

//sort and retrieve 10 most recent searches
function getHistory(res) {
    //example query to get every image
    var history = [];
    mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASS}@ds137759.mlab.com:37759/freecodecamp`);
    var query = Search.find({}).sort({timestamp: 'descending'}).limit(10);
    query.exec(function(err,searches) {
        if(err) throw err;
        console.log("History Found");
        searches.forEach(search => history.push({searchTerm: '', timestamp: 0}));
        for(var i = 0; i < searches.length; i++) {
            history[i].searchTerm = searches[i].searchTerm;
            history[i].timestamp = searches[i].timestamp;
        }
        res.json(history);
    });
    mongoose.connection.close();
}

function getImagesOffset(req,res) {
    saveSearch(req.params.searchStr);
    request(`https://pixabay.com/api/?key=${process.env.PIXKEY}&q=${req.params.searchStr}&image_type=photo&per_page=10&page=${req.query.offset}`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.json(JSON.parse(body));
        } else {
            console.log(error);
        }
    });
}

function getImages(req,res) {
    saveSearch(req.params.searchStr);
    request(`https://pixabay.com/api/?key=${process.env.PIXKEY}&q=${req.params.searchStr}&image_type=photo&per_page=10`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.json(JSON.parse(body));
        } else {
            console.log(error);
        }
    });
}



module.exports = router;