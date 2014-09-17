
// NOTE that app is defined globally

var Bet = require('./../model/Bet.js');
var BetStatus = require('./../model/BetStatus.js');
var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');
var weekChecks = require('./../middlewares/weekChecksForBets.js');

var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var setUserId = function(req, res, next, user) {
    // set userId
    req.body.userId = user._id;
    req.body.username = user.username;
}

Bet
.methods(['get', 'post', 'put', 'delete'])

.before('post', weekChecks.weekMiddleware([weekChecks.callbacks.checkIfWeekEnded, weekChecks.callbacks.checkIfCorrectNumberOfMatches]))
.before('put', weekChecks.weekMiddleware([weekChecks.callbacks.checkIfWeekEnded, weekChecks.callbacks.checkIfCorrectNumberOfMatches]))

.before('post',
function(req, res, next) {

    req.body.points = 0;
    req.body.ended = false;
    req.body.status = BetStatus.active;

    next();

})

.before('get', jwtauth([tokenChecks.hasRoleWithId('ROLE_USER'), tokenChecks.hasRoleWithoutId('ROLE_ADMIN')]))
.before('post', jwtauth([tokenChecks.hasRole('ROLE_USER'), setUserId]))
.before('put', jwtauth([tokenChecks.hasRole('ROLE_USER'), setUserId]))
.before('delete', jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]))

;



Bet.register(app, '/api/bet');