
// NOTE that app is defined globally

var User = require('./../model/User.js');
var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');

var express = require('express');

var router = express.Router();

router.get('/ranking', jwtauth([tokenChecks.hasRole('ROLE_USER')]), function(req, res) {

    User.find({},
    {password: 0, salt: 0, serverSalt: 0, _v: 0, email: 0, birthDate: 0, registrationIp: 0},
    function (err, users) {

        if (err) {
            res.json({message: "An error has occured."}).end();
        }

        else {
            res.json(users).end();
        }

    }
    ).sort({points: -1});

});

app.use('/api', router);

