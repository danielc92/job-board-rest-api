const Skill = require('../models/skill.model');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const select = require('../constants/select');

/*
Get skill list
*/
router.get('/list', authMiddleware, (request, response) => {
    Skill.find()
        .select(select.GET_SKILL)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(400).json({ error }))
})

/*
Create skill
*/
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
    if (result.name === 'ValidationError') return response.status(400).json({error: "Validation error", result})

    return response.status(200).json({ message: `'${name}' skill has been successfully created.`})
    
})

module.exports = router;