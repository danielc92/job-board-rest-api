const express = require('express');
const router = express.Router();
const JobCategory = require('../models/category.model');

router.get('/', (request, response) => {
    JobCategory.find()
        .then(results => response.status(200).json({ results }))
        .catch(error => response.status(400).json({ error }))
})

module.exports = router;