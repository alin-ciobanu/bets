var express = require('express');
var jwt = require('jwt-simple');
var bodyParser = require('body-parser');
var restful = require('node-restful');
var mongoose = restful.mongoose;
var methodOverride = require('method-override');
var path = require('path');
GLOBAL.app = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.query());
app.use(methodOverride());
app.use(function (req, res, next) {
    // url decoding middleware
    req.url = decodeURIComponent(req.url);
    req.url = req.url.replace(/[/]+/g, '/');
    next();
});

app.set('jwtTokenSecret', 'YOUR_SECRET_STRING'); // use token service

mongoose.connect("mongodb://localhost/bets");

db = mongoose.connection;
db
    .on('error', function () {console.error('DB connection error.')})
    .once('open', function() {console.log('DB Connection established.')});

var port = 8080;

var user = require('./model/User.js');
var user = require('./route/UserRoute.js');
var user = require('./route/LoginRoute.js');
var user = require('./route/InitRoute.js');

// resolve statics
// use client folder root path / and server index.html
// DO NOT MOVE UPSIDE - it should stay AFTER app.use new routes
app.use('/', express.static(path.resolve('client/')));
app.use(function(req, res) {
    console.log("req.connection", req.connection);
    res.sendfile(path.resolve('client/index.html'));
});


// START THE SERVER
app.listen(port);
console.log('Server started on port ' + port);


