
var mongoose = require('mongoose');

var WeekSchema = mongoose.Schema({
    number: {type: 'number', required: true},
    events: {type: Array, required: true},
    locked: {type: Boolean, required: false}, // not used
    endDate: {type: Date, required: false},
    required: {type: 'number', required: true},
    ended: {type: Boolean, required: false},
    mailNotificationSent: {type: Boolean, required: false},
    hidden: {type: Boolean, required: true}
});

module.exports = mongoose.model('week', WeekSchema);
