const express = require('express')
const Benefit = require('../models/benefit.model')
const router = express.Router()
const authMiddleware = require('../middleware/auth.middleware')

/*
Get benefits list
*/
router.get('/list', authMiddleware, (request, response) => {
    Benefit.find({})
        .then(results => response.status(200).json(results))
        .catch(error => response.status(400).json({ error }))
})

/*
Get benefit detail
*/
router.post('/', (request, response) => {
    
    const new_item = new Benefit(request.body)
    
    new_item.save()
        .then(result => response.status(200).json(result))
        .catch(error => response.status(400).json({ error }))  
})

module.exports = router