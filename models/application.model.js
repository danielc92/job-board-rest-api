const mongoose = require('mongoose');

const JobApplicationSchema = mongoose.Schema({
    applicant_id: {
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
        default: "pending",
        trim: true,
        lowercase: true,
        enum: ['pending','rejected', 'interested', 'withdrawn']
    },
    user_message: {
        type: String,
        default: null,
        trim: true,
        maxlength: 1000,
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