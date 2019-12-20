const mongoose = require('mongoose');

const LocationSchema = mongoose.Schema({
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number]
        }
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