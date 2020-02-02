const Skill = require('../models/skill.model')
const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth.middleware')
const select = require('../constants/select')

/*
Get skill list
*/
router.get('/list', authMiddleware, (request, response) => {
    Skill.find()
        .select(select.GET_SKILL)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(400).json({ error }))
})

module.exports = router