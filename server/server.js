
var express = require('express');
var jwt = require('jwt-simple');
var bodyParser = require('body-parser');
var restful = require('node-restful');
var mongoose = restful.mongoose;
var methodOverride = require('method-override');
var path = require('path');
var fs = require('fs');

GLOBAL.app = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.query());
//app.use(methodOverride());
app.use(function (req, res, next) {
    // url decoding middleware
    req.url = req.url
        .replace(/\&/gi, '%26')
        .replace(/=/gi, '%3D')
        .replace(/\+/gi, '%2B')
        .replace(/@/gi, '%40')
        .replace(/:/gi, '%3A')
        .replace(/\$/g, '%24')
        .replace(/,/gi, '%2C');
    try {
        req.url = decodeURIComponent(req.url);
    }
    catch (err) {
        console.log(req.url);
    }
    req.url = req.url.replace(/[/]+/g, '/');
    next();
});

// use token service
var filename = "server/config/secretString";
var secretString = fs.readFileSync(filename, "utf8");
app.set('jwtTokenSecret', secretString);

mongoose.connect("mongodb://localhost/bets");

db = mongoose.connection;
db
    .on('error', function () {console.error('DB connection error.')})
    .once('open', function() {console.log('DB Connection established.')});

var port = 80;

require('./route/TestRoute.js');
require('./route/InitRoute.js');
require('./model/User.js');
require('./route/UserRoute.js');
require('./route/LoginRoute.js');
require('./route/RolesRoute.js');
require('./route/RankingRoute.js');
require('./route/WeekRoute.js');
require('./route/BetRoute.js');
require('./route/BetsPerWeek.js');
require('./route/BetHistoryRoute.js');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(smtpTransport({
    host: 'localhost',
    port: 25,
    debug: true,
    /*    auth: {
     user: 'alin',
     pass: 'pass'
     },*/
    maxConnections: 5,
    maxMessages: 10
}));

transporter.sendMail({
    from: 'alin@address.com',
    to: 'alin.ciobanu@teamnet.ro',
    subject: 'hi',
    text: 'hello world!'
});

// resolve statics
// use client folder as root path /
app.use('/', express.static(path.resolve('client/')));

// START THE SERVER
app.listen(port);
console.log('Server started on port ' + port);
