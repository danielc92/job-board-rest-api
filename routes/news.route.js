const express = require('express')
const router = express.Router()
const News = require('../models/news.model')
const limit = require('../constants/limit')
const select = require('../constants/select')
const client = require('../redis-client')
const {ONE_HOUR} = require('../constants/ttl')

router.get('/list', (request, response) => {
    const { page } = request.query
    let options = {
        select: select.GET_NEWS_LIST,
        sort: { createdAt: 'desc' },
        lean: true,
        limit: limit.NEWS_LIST,
        page: page ? page : 1
    }

    const key = `news:list:p${options.page}`

    client.get(key, function(err, reply) {
        if (reply) return response.status(200).json({ results: JSON.parse(reply)})

        News.paginate({}, options)
            .then(results => {
                client.setex(key, ONE_HOUR, JSON.stringify(results))
                return response.status(200).json({ results })
            })
            .catch(error => response.status(400).json({ error: 'An error occured. Could not find news list.' }))
    })
})

router.get('/', (request, response) => {
    
    const { slug } = request.query

    const key = `news:detail:${slug}`

    client.get(key, function(err, reply) {
        if (reply) return response.status(200).json({results: JSON.parse(reply)})
        News.findOne({ slug })
            .then(results => {
                if (!results) return response.status(400).json({ error: 'Sorry, we could not find this article.'})
                client.setex(key, ONE_HOUR, JSON.stringify(results))
                return response.status(200).json({ results })
            })
            .catch(error => response.status(400).json({ error: 'An error occured. Could not find news article.'}))
    })
})

module.exports = router

