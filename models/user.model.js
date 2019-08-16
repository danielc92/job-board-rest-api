const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    first_name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    skils: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    }]
},
{
    timestamps: true
})

module.exports = mongoose.model('User', UserSchema)