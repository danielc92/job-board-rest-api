const Application = require('../models/application.model');
const express = require('express');
const router = express.Router();

router.post('/', (request, response) => {

    const new_item = new Application(request.body)

    new_item.save()
        .then(result => response.status(200).json({ result }))
        .catch(error => response.status(400).json({ error }))
})

router.get('/', (request, response) => {
    Application.find()
        .then(results => response.status(200).json({ results }))
        .catch(error => response.status(400).json({ error }))
})

module.exports = router;