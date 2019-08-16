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
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('JobApplication', JobApplicationSchema)