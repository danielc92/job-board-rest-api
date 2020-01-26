const express = require('express')
const router = express.Router()
const Category = require('../models/category.model')
const authMiddleware = require('../middleware/auth.middleware')

/*
Get category list
*/
router.get('/list', (request, response) => {
    Category.find()
        .sort('name')
        .then(results => response.status(200).json(results))
        .catch(error => response.status(400).json({ error }))
})

/*
Create category
*/
router.post('/', async (request, response) => {
    
    const { name } = request.body

    // Check if Category exists and return response if so.
    let exists = await Category.findOne({ name })
    if (exists) return response.status(400).json({ error: 'Category already exists.'})
    
    // Create new Category object and attempt to save
    let category = new Category({ name })

    let result = await category.save()
        .then(result=>result)
        .catch(error=>error)
    
    // Check for validation error, else naively return status 200
    if (result.name === 'ValidationError') return response.status(400).json({error: 'Validation error', result})

    return response.status(200).json({ message: `'${name}' Category has been successfully created.`})
    
})
module.exports = router