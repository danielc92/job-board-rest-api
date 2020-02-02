const express = require('express')
const router = express.Router()
const Category = require('../models/category.model')

/*
Get category list
*/
router.get('/list', (request, response) => {
    Category.find()
        .sort('name')
        .then(results => response.status(200).json(results))
        .catch(error => response.status(400).json({ error }))
})

module.exports = router