const Skill = require('../models/skill.model');
const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
    Skill.find()
        .then(result => response.status(200).json(result))
        .catch(error => response.status(400).json({ error }))
})

router.post('/', (request, response) => {
    const new_item = new Skill(request.body)

    new_item.save()
        .then(result => response.status(200).json(result))
        .catch(error => response.status(400).json({ error }))
})

module.exports = router;