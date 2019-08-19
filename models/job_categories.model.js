const mongoose = require('mongoose');

const JobCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('JobCategory', JobCategorySchema)