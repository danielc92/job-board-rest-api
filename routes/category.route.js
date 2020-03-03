const express = require('express')
const router = express.Router()
const Category = require('../models/category.model')
const client = require('../redis-client')
const { THREE_HOURS } = require('../constants/ttl')
const key = 'cat:list'

/*
Get category list
*/
router.get('/list', (request, response) => {

    client.get(key, function (err, reply) {
        if (reply) return response.status(200).json(JSON.parse(reply))
        Category.find()
            .select('name')
            .sort('name')
            .lean()
            .then(results => {
                client.setex(key, THREE_HOURS, JSON.stringify(results))
                return response.status(200).json(results)
            })
            .catch(error => response.status(400).json({ error }))
    })
    
})

module.exports = router