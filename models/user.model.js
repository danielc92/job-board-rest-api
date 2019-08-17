const mongoose = require('mongoose');
const settings = require('../settings');
const jwt = require('jsonwebtoken');


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
    admin: {
        type: Boolean,
        default: false
    },
    skills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    }]
},
{
    timestamps: true
})

UserSchema.methods.makeToken = () => {

    const tokenHash = jwt.sign(
        {
            _id: this._id
        },
        settings.token_secret,
        {
            expiresIn: settings.token_expiry_seconds
        }
    )

    const token = {
        "x-auth-token": tokenHash,
        "expiry-in-seconds": settings.token_expiry_seconds
    }

    return token;
}

module.exports = mongoose.model('User', UserSchema)