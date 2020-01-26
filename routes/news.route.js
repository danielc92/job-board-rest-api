const express = require('express')
const router = express.Router()
const News = require('../models/news.model')

router.get('/list', (request, response) => {
    const { page } = request.query
    let options = {
        select: 'title summary category createdAt',
        sort: { createdAt: 'desc' },
        limit: 5,
    }

    if (page) options.page = page 
    News.paginate({}, options)
        .then(results => response.status(200).json({ results }))
        .catch(error => response.status(400).json({ error: 'An error occured. Could not find news list.' }))
})

router.get('/', (request, response) => {
    
    const { _id } = request.query
    News.findById({ _id })
        .then(results => response.status(200).json({ results }))
        .catch(error => response.status(400).json({ error: 'An error occured. Could not find news article.'}))
})

router.post('/', (request, response) => {
    const newsItem = new News({ ...request.body})

    newsItem.save()
        .then(result => response.status(200).json({ message: 'Successfully created article' }))
        .catch(error => response.status(400).json({ error: 'Could not create news.'}))
})

module.exports = router

