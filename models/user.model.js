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
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
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
    is_employer: {
        type: Boolean,
        default: false,
    },
    skills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    }],
    availability: {
        type: Boolean,
        lowercase: true,
        trim: true
    },
    summary: {
        type: String,
        trim: true
    },
    achievements: {
        type: String,
        trim: true
    },
    education: {
        type: String,
        trim:true
    },
    experience: {
        type: String,
        trim: true
    }
},
{
    timestamps: true
})

UserSchema.methods.makeToken = function() {

    const tokenHash = jwt.sign(
        {
            _id: this._id,
            email: this.email,
            is_employer: this.is_employer,
        },
        settings.token_secret,
        {
            expiresIn: settings.token_expiry_seconds
        }
    )

    const token = {
        "x-auth-token": tokenHash,
    }

    return token;
}

module.exports = mongoose.model('User', UserSchema)