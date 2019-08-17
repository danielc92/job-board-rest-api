const User = require('../models/user.model');
const express = require('express');
const router = express.Router();

router.post('/auth/register', (request, response) => {

    
})

router.post('/auth/login', (request, response) => {

})

router.get('/', (request, response) => {
    User.find()
        .then(results => response.status(200).json({ results }))
        .catch(error => response.status(400).json({ error }))
})

module.exports = router;