const User = require('../models/user.model');
const express = require('express');
const router = express.Router();

router.post('/', (request, response) => {

    const new_item = new User(request.body)

    new_item.save()
        .then(result => response.status(200).json({ result }))
        .catch(error => response.status(400).json({ error }))
})

router.get('/', (request, response) => {
    User.find()
        .then(results => response.status(200).json({ results }))
        .catch(error => response.status(400).json({ error }))
})

module.exports = router;