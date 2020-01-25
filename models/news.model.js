const mongoose = require('mongoose');

const NewsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    paragraphs: {
        type: [String],
        required: true
    },
},
{
    timestamps: true
})

const News = mongoose.model('News', NewsSchema);

module.exports = News