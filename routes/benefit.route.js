const express = require('express')
const Benefit = require('../models/benefit.model')
const router = express.Router()
const {ONE_MINUTE} = require('../constants/ttl')
const client = require('../redis-client')

/*
Get benefits list
*/
router.get('/list', (request, response) => {
    client.get('ben:list', function (err, reply) {
        if (reply) return response.status(200).json({results: JSON.parse(reply)})
        Benefit.find()
            .select('name')
            .sort('name')
            .lean()
            .then(results => {
                client.setex('ben:list', ONE_MINUTE, JSON.stringify(results))
                return response.status(200).json({results})
            })
            .catch(error => response.status(400).json({ error }))
    })
})

module.exports = router