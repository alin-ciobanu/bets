
var User = require('./../model/User.js');
var jwt = require('jwt-simple');

module.exports = function (callbacks) {

    return function(req, res, next) {

        var token = req.headers['x-access-token'];

        if (token) {
            try {
                var decoded = jwt.decode(token, app.get('jwtTokenSecret'));

                if (decoded.exp <= new Date()) {
                    res.status(401).json({
                        message: "Your token expired. Please log in again."
                    }).end();
                }
                else {
                    // get the user
                    User.findOne({ _id: decoded.iss }, function(err, user) {

                        if (err) {
                            res.status(401).json({
                                message: "An error has occurred. We couldn't verify your identity."
                            }).end();
                        }
                        else {

                            var errorFromCallbacks = false;
                            for (var i in callbacks) {
                                callbacks[i](req, res, next, user, function () {
                                    errorFromCallbacks = true;
                                });
                            }

                            if (!errorFromCallbacks) {
                                if (!res.data || !res.data.local) {
                                    res.data = {
                                        local: {}
                                    };
                                }
                                res.data.local.user = user;
                                next();
                            }

                        }
                    });
                }

            } catch (err) {
                res.status(401).json({
                    message: "Your token expired. Please log in again."
                }).end();
            }
        } else {
            res.status(401).json({
                message: "You didn't send an authorization token."
            }).end();
        }

    };
}
