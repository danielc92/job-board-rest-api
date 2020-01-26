const mongoose = require('mongoose')

const BenefitSchema = mongoose.Schema({
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

module.exports = mongoose.model('Benefit', BenefitSchema)