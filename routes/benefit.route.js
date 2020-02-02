const express = require('express')
const Benefit = require('../models/benefit.model')
const router = express.Router()
const authMiddleware = require('../middleware/auth.middleware')

/*
Get benefits list
*/
router.get('/list', (request, response) => {
    Benefit.find({})
        .then(results => response.status(200).json(results))
        .catch(error => response.status(400).json({ error }))
})

module.exports = router