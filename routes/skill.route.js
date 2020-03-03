const Skill = require('../models/skill.model')
const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth.middleware')
const select = require('../constants/select')
const {THREE_HOURS} = require('../constants/ttl')
const client = require('../redis-client')
const key = 'skill:list'

/*
Get skill list
*/
router.get('/list', authMiddleware, (request, response) => {
    client.get(key, function (err, reply) {
        if (reply) return response.status(200).json(JSON.parse(reply))
        Skill.find()
            .select(select.GET_SKILL)
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