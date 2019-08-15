const mongoose = require('mongoose')

const SkillSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('Skill', SkillSchema)