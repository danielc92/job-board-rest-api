const Test = require('../models/test.model');
const express = require('express');
const router = express.Router();

// Make a post request to test route
router.post('/', (request, response) => {

    const new_item = new Test(request.body)

    new_item.save()
        .then(result => response.status(200).json({ result }))
        .catch(error => response.status(400).json({ error }))
})

// Make a get request to test route
router.get('/', (request, response) => {
    const results = Test.find()
    response.status(200).json(results)
})

module.exports = router;