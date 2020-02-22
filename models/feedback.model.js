const mongoose = require('mongoose')

const FeedbackSchema = mongoose.Schema({
    category: {
        type: String,
        enum: [
            'suggestion',
            'general',
            'report',
            'other',
        ],
        required:true,
    },
    message:{
        type: String,
        required:true,
        maxLength: 500
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
    }
   
},
{
    timestamps: true
})

module.exports = mongoose.model('Feedback', FeedbackSchema)