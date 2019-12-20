const mongoose = require('mongoose');

LocationSchema = mongoose.Schema({
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

