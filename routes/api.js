require('dotenv').config();
var express = require('express');
var mongoose = require('mongoose');
var moment = require('moment');
var request = require('request');
var router = express();
var Search = require('../models/search.js');

//search endpoint
router.get('/api/search/:searchStr', function(req, res, next) {
    return req.query.offset && (/^\d+$/g).test(req.query.offset) ? getImages(req, res, req.query.offset) : getImages(req,res);
});

//history endpoint
router.get('/api/history', function(req,res) {
    getHistory(res);
});

//store search
function saveSearch(search) {
    mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@ds137759.mlab.com:37759/freecodecamp`);
    var searchDocument = Search({ //create search document based off of Search schema
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
    console.log('running history function');
    var history = [];
    mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@ds137759.mlab.com:37759/freecodecamp`);
    var query = Search.find({}).sort({timestamp: 'descending'}).limit(10); //find and sort last ten searches
    query.exec(function(err,searches) {
        if(err) throw err;
        searches.forEach(search => history.push({searchTerm: '', timestamp: 0})); //add empty object to history array for each search
        for(var i = 0; i < searches.length; i++) {  //populate search objects with values
            history[i].searchTerm = searches[i].searchTerm;
            history[i].timestamp = searches[i].timestamp;
        }
        res.json(history);
    });
    mongoose.connection.close();
}

//request images from pixabay
function getImages(req,res,offset) {
    saveSearch(req.params.searchStr); //save search to database
    if(offset) {
        request(`https://pixabay.com/api/?key=${process.env.PIXKEY}&q=${req.params.searchStr}&image_type=photo&per_page=10&page=${req.query.offset}`, 
                function (error, response, body) {
                    return !error && response.statusCode == 200 ? res.json(JSON.parse(body)) : console.log(error);
                });
    } else {
         request(`https://pixabay.com/api/?key=${process.env.PIXKEY}&q=${req.params.searchStr}&image_type=photo&per_page=10`, 
            function (error, response, body) {
                return !error && response.statusCode == 200 ? res.json(JSON.parse(body)) : console.log(error);
            });
    }
}



module.exports = router;