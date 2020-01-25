const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const NewsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    paragraphs: {
        type: [String],
        required: true
    },
    brief: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})


NewsSchema.plugin(mongoosePaginate);
const News = mongoose.model('News', NewsSchema);

module.exports = News