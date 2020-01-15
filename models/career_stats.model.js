const mongoose = require('mongoose')

// This schema should live seperately to user, as employers will not populate it, only seekers.

const CareerStatSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    summary: {
        type: String,
        maxlength: 300,
        default: ""
    },
    skills: {
        type: [String],
        default: [],
    },
    achievements: {
        type: [Object],
        default: [],
    },
    available: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: Number,
        default: null,
    }

},
{
    timestamps: true
})

const CareerStatModel = mongoose.model('CareerStat', CareerStatSchema)

module.exports = CareerStatModel