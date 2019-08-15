const mongoose = require('mongoose');

const JobSchema = mongoose.Schema(
    {
        job_title: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        company_desc: {
            type: String,
            required: true,
            trim: true
        },
        requirements: {
            type: String,
            reqyured: true,
            lowercase: true,
            trim: true
        },
        industry: {
            type: String,
            reqyured: true,
            lowercase: true,
            trim: true
        },
        salary_range_low: {
            type: Number,
            min: 0,
            max: 1000000000
        },
        salary_range_high: {
            type: Number,
            min: 0,
            max: 1000000000
        },
        closes: {
            type: Date
        }
    },
    {
        timestamps: true
    })

module.exports = mongoose.model('Job', JobSchema)