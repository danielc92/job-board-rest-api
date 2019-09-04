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
        company_summary: {
            type: String,
            trim: true,
            maxlength: 500
        },
        job_summary: {
            type: String,
            trim: true,
            maxlength: 500
        },
        contact_summary: {
            type: String,
            trim: true,
            maxlength: 500
        },
        requirements: [{
            type: String,
            required: true,
            lowercase: true,
            trim: true
        }],
        lga_code: {
            type: String,
            required: false, //disable required until suitable dataset is found for lga codes
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