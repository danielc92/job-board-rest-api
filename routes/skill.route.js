const Skill = require('../models/skill.model')
const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth.middleware')
const select = require('../constants/select')
const {ONE_MINUTE} = require('../constants/ttl')
const client = require('../redis-client')

/*
Get skill list
*/
router.get('/list', authMiddleware, (request, response) => {
    client.get('skill:list', function (err, reply) {
        if (reply) return response.status(200).json(JSON.parse(reply))
        Skill.find()
            .select(select.GET_SKILL)
            .sort('name')
            .lean()
            .then(results => {
                client.setex('skill:list', ONE_MINUTE, JSON.stringify(results))
                return response.status(200).json(results)
            })
            .catch(error => response.status(400).json({ error }))
    })
})

module.exports = router