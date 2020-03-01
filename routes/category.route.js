const express = require('express')
const router = express.Router()
const Category = require('../models/category.model')
const client = require('../redis-client')
const { ONE_MINUTE } = require('../constants/ttl')
/*
Get category list
*/
router.get('/list', (request, response) => {

    client.get('cat:list', function (err, reply) {
        if (reply) return response.status(200).json(JSON.parse(reply))
        Category.find()
            .select('name')
            .sort('name')
            .lean()
            .then(results => {
                client.setex('cat:list', ONE_MINUTE, JSON.stringify(results))
                return response.status(200).json(results)
            })
            .catch(error => response.status(400).json({ error }))
    })

    
    
})

module.exports = router