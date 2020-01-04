const JobApplication = require('../models/application.model');
const User = require('../models/user.model');
const Job = require('../models/job.model');
const express = require('express');
const router = express.Router();
// const {} = 

router.post('/', async (request, response) => {

    // First store the request body
    const { applicant_id, job_id } = request.body;

    try {
        let userExists = await User.findOne({ _id: applicant_id })
        if (!userExists) return response.status(400).json({ error: "User does not exist"})
    
        let jobExists = await Job.findOne({ _id: job_id })
        if (!jobExists) return response.status(400).json({ error: "Job does not exist"})
    
        let applicationExists = await JobApplication.findOne({ applicant_id, job_id})
        if (applicationExists) return response.status(400).json({ error: "You've already applied for this job."})
    }
    catch {
        return response.status(400).json({ error: "Invalid id."})
    }
   

    const application = new JobApplication({
        applicant_id, job_id
    })
    
    application.save()
        .then(result => response.status(200).json({ result }))
        .catch(error => response.status(400).json({ error }))
})

router.get('/', (request, response) => {
    JobApplication.find()
        .populate("applicant_id job_id")
        .then(results => response.status(200).json({ results }))
        .catch(error => response.status(400).json({ error }))
})

router.get('/list', (request, response) => {

    const { applicant_id } = request.query;
    JobApplication.find({ applicant_id})
        .populate({
            path: 'job_id',
            select: 'title'
        })
        .sort('-createdAt')
        .then(results => response.status(200).json({ results }))
        .catch(error => response.status(400).json({ error }))
})

module.exports = router;