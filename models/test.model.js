const mongoose = require('mongoose');

const TestSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    country: {
        type: String
    }
},
{
    timestamps: true
})

const Test = mongoose.model('Test', TestSchema)

module.exports = Test;