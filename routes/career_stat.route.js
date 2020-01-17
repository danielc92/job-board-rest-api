const express = require('express');
const CareerStat = require('../models/career_stats.model');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const select = require('../constants/select');

/*
Get profile detail (Seeker)
*/
router.get('/', authMiddleware, (request, response) => {
    
    const {_id} = request.user;

    CareerStat.findOne({ user_id: _id })
    .select(select.GET_PROFILE)
    .then(result => response.status(200).json({ result }))
    .catch(error => response.status(400).json({ message: "An error occured. No profile found."}))
})

/*
Update profile (Seeker)
*/
router.patch('/', authMiddleware, (request, response ) => {
    
    const { _id } = request.user;

    const {
        summary,
        skills,
        experience,
        achievements,
        available,
        phone
    } = request.body;

    let patch = { }
    if (summary) { patch = {...patch, summary }}
    if (skills) { patch = {...patch, skills }}
    if (experience) { patch = {...patch, experience }}
    if (achievements) { patch = {...patch, achievements }}
    if (available) { patch = {...patch, available }}
    if (phone) { patch = {...patch, phone }}

    const query = { user_id: _id }
    const options = { runValidators: true }
    CareerStat.findOneAndUpdate(query, patch, options)
    .then(result => response.status(200).json({ message: "Successfully updated career stats.", result}))
    .catch(error => response.status(400).json({ message: "Failed to update career stats."}))
    
})

module.exports = router;