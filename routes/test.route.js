// [NOTE] This route is to test certain mongoose functions only

const Test = require('../models/test.model');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// Make a post request to test route
router.post('/', (request, response) => {

    const new_item = new Test(request.body)

    new_item.save()
        .then(result => response.status(200).json({ result }))
        .catch(error => response.status(400).json({ error }))
})

// Make a get request to test route
router.get('/', authMiddleware, (request, response) => {
    Test.find()
        .then(results => response.status(200).json({ results }))
        .catch(error => response.status(400).json({ error }))
})

module.exports = router;