const express = require('express');
const router = express.Router();
const Location = require('../models/location.model');
const authMiddleware = require('../middleware/auth.middleware');
const limit = 16;

router.get('/', authMiddleware, (request, response) => {
    Location.find({})
    .select('location location_string state postcode locality -_id')
    .limit(limit)
    .then(results => response.status(200).json(results))
    .catch(error => response.status(400).json({ error }))
})

module.exports = router;
