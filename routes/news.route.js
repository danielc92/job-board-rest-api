const express = require('express')
const router = express.Router()
const News = require('../models/news.model')
const limit = require('../constants/limit')
const select = require('../constants/select')

router.get('/list', (request, response) => {
    const { page } = request.query
    let options = {
        select: select.GET_NEWS_LIST,
        sort: { createdAt: 'desc' },
        limit: limit.NEWS_LIST,
    }

    if (page) options.page = page 
    News.paginate({}, options)
        .then(results => response.status(200).json({ results }))
        .catch(error => response.status(400).json({ error: 'An error occured. Could not find news list.' }))
})

router.get('/', (request, response) => {
    
    const { slug } = request.query
    News.findOne({ slug })
        .then(results => {
            if (!results) return response.status(400).json({ error: 'Sorry, we could not find this article.'})
            return response.status(200).json({ results })
        })
        .catch(error => response.status(400).json({ error: 'An error occured. Could not find news article.'}))
})

module.exports = router

