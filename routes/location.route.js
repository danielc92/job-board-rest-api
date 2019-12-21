const express = require('express');
const router = express.Router();
const Location = require('../models/location.model');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, (request, response) => {
    Location.find({})
    .limit(16)
    .then(results => response.status(200).json(results))
    .catch(error => response.status(400).json({ error }))
})

module.exports = router;
