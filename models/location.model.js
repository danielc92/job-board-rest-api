const mongoose = require('mongoose');

const LocationSchema = mongoose.Schema({
    location: {
        type: {},
        coordinates: {}
    },
    state: {
        type: String,
        required: true,
    },
    merged: String,
    postcode: Number,
    locality: String,

})

const Location = mongoose.model('Location', LocationSchema);

module.exports = Location