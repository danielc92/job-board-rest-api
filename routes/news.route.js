const express = require('express')
const router = express.Router()
const News = require('../models/news.model')

router.get('/list', (request, response) => {
    const { page } = request.query;
    let options = {
        select: 'title brief',
        sort: { createdAt: 'desc' },
        limit: 5,
    };

    if (page) { options.page = page }

    News.paginate({}, options)
    .then(results => response.status(200).json({ results }))
    .catch(error => response.status(400).json({ error: 'An error occured. Could not find news list.' }))
})

router.get('/', (request, response) => {
    
    const { _id } = request.query;
    News.findById({ _id })
    .then(result => response.status(200).json({ result }))
    .catch(error => response.status(400).json({ error: 'An error occured. Could not find news article.'}))
})

module.exports = router;

