const mongoose = require('mongoose')

const FeedbackSchema = mongoose.Schema({
    category: {
        type: String,
        enum: [
            'suggestion',
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
        required: true,
    }
   
},
{
    timestamps: true
})

module.exports = mongoose.model('Feedback', FeedbackSchema)