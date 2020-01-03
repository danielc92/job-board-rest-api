const Application = require('../models/application.model');
const User = require('../models/user.model');
const Job = require('../models/job.model');
const express = require('express');
const router = express.Router();


router.post('/', async (request, response) => {

    // First store the request body
    const { applicant_id, job_id } = request.body;

    let userExists = User.findOne({ _id: applicant_id })
    if (!userExists) return response.status(400).json({ error: "User does not exist or invalid"})

    let jobExists = Job.findOne({ _id: job_id })
    if (!jobExists) return response.status(400).json({ error: "Job does not exist or invalid"})
    
    const application = new Application({
        applicant_id, job_id
    })

    application.save()
        .then(result => response.status(200).json({ result }))
        .catch(error => response.status(400).json({ error }))
})

router.get('/', (request, response) => {
    Application.find()
        .populate("applicant_id job_id")
        .then(results => response.status(200).json({ results }))
        .catch(error => response.status(400).json({ error }))
})

module.exports = router;