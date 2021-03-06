
// NOTE that app is defined globally

var User = require('./../model/User.js');
var jwtauth = require('./../middlewares/jwtauth.js');
var pointsManagementFunctions = require('./../middlewares/pointsManagement.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');

var Translations = require('./../config/Translations.js');

var express = require('express');
var router = express.Router();

router.get('/ranking', jwtauth([tokenChecks.hasRole('ROLE_USER')]), function(req, res) {

    User.find({},
    {password: 0, salt: 0, serverSalt: 0, _v: 0, birthDate: 0, registrationIp: 0, active: 0, disabled: 0},
    {sort: {points: -1, avgPoints: -1, wonWeeks: -1}},
    // sort by points descending, then by average points if they are equal and finally by won weeks
    function (err, users) {

        if (err) {
            res.json({message: Translations[req.query.lang].rankingRoute.anErrorOccurred}).end();
        }

        else {
            res.json(users).end();
        }

    }
    );

});

router.get('/ranking/recalculate',
    jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]),
    pointsManagementFunctions.calculateWinners,
    pointsManagementFunctions.setWinnersOnBets,
    pointsManagementFunctions.resetUsersPointsBeforeAggregating,
    pointsManagementFunctions.updatePointsForUsers,
    pointsManagementFunctions.updateUsersPlace
);

app.use('/api', router);

