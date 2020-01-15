const express = require('express');
const CareerStat = require('../models/career_stats.model');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, (request, response) => {
    
    const user_id = request.user._id;

    CareerStat.findOne({ user_id })
    .select('summary skills experience achievements available phone -_id')
    .then(result => response.status(200).json({ result }))
    .catch(error => response.status(400).json({ message: "An error occured. No profile found."}))
})

router.patch('/', authMiddleware, (request, response ) => {
    
    const user_id = request.user._id;

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

    console.log('THIS IS PATCH', patch)
    const query = { user_id }
    CareerStat.findOneAndUpdate(query, patch)
    .then(result => response.status(200).json({ message: "Successfully updated career stats."}))
    .catch(error => response.status(400).json({ message: "Failed to update career stats."}))
    
})

module.exports = router;

// summary: {
//     type: String,
//     maxlength: 300,
//     default: ""
// },
// skills: {
//     type: [String],
//     default: [],
// },
// experience: {
//     type: [Object],
//     default: [],
// },
// achievements: {
//     type: [Object],
//     default: [],
// },
// available: {
//     type: Boolean,
//     default: false,
// },
// phone: {
//     type: Number,
//     default: null,
// }