
// NOTE that app is defined globally

var initFeed = {
    user: {
        address: "/api/user",
        roles: "/api/roles",
        ranking: "/api/ranking",
        activate: "/api/user/activate",
        details: "/api/user/details"
    },
    auth: {
        login: "/api/auth/login",
        salt: "/api/auth/salt"
    },
    week: {
        address: "/api/week",
        current: "/api/week/last",
        beforeLast: "/api/week/beforeLast"
    },
    bet: {
        address: "/api/bet",
        byWeek: "/api/bets/getBetByWeek",
        history: "/api/bet/history"
    }
};

var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
    res.status(200).json(initFeed).end();
});

app.use('/api', router);
