const mongoose = require('mongoose');

const JobSchema = mongoose.Schema(
    {
        creator_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            trim: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
            trim: true
        },
        benefits: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Benefit'
        }],
        skills: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill' 
        }],
        title: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        about_company: {
            type: String,
            trim: true
        },
        about_job: {
            type: String,
            trim: true
        },
        requirements: [{
            type: String,
            required: true,
            lowercase: true,
            trim: true
        }],
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