const mongoose = require('mongoose');

const JobApplicationSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    status: {
        type: String,
        default: "applied",
        trim: true,
        lowercase: true
    },
    rating: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('JobApplication', JobApplicationSchema)