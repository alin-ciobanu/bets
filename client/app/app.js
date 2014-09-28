
var betsModule = angular.module(
    'bets', // module name
    [
        // dependencies
        'templates',
        'user',
        'resources',
        'config',
        'ranking',
        'week',
        'profile',
        'history',
        'admin'
    ]
);

var REST_HOSTNAME = ''; // relative path to local rest provider
