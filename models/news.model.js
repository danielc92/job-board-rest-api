const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const NewsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: [String],
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['update', 'news article']
    }
},
{
    timestamps: true
})


NewsSchema.plugin(mongoosePaginate);
const News = mongoose.model('News', NewsSchema);

module.exports = News