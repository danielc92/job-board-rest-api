const Skill = require('../models/skill.model');
const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
    Skill.find()
        .then(result => response.status(200).json(result))
        .catch(error => response.status(400).json({ error }))
})

router.post('/', async (request, response) => {
    
    const { name } = request.body;

    // Check if skill exists and return response if so.
    let exists = await Skill.findOne({ name })
    if (exists) return response.status(400).json({ error: "Skill already exists."})
    
    // Create new skill object and attempt to save
    let skill = new Skill({ name })

    let result = await skill.save()
        .then(result=>result)
        .catch(error=>error)
    
    // Check for validation error, else naively return status 200
    if (result.name === 'ValidationError') return response.status(400).json({error: "Validation error"})

    return response.status(200).json({ message: `'${name}' skill has been successfully created.`})
})

module.exports = router;