const JobApplication = require('../models/application.model');
const User = require('../models/user.model');
const Job = require('../models/job.model');
const express = require('express');
const router = express.Router();
const select = require('../constants/select');
const authMiddleware = require('../middleware/auth.middleware');
const mongoose = require('mongoose')

router.patch('/', async (request, response) => {
    const { applicant_id, job_id, status } = request.query;
    if (!applicant_id || !job_id || !status) return response.status(400).json({ error: 'A value has been omitted.'})
    
    const update = { status }
    const query = { applicant_id, job_id }

    JobApplication.findOneAndUpdate(query, update)
    .then(result => response.status(200).json({ message: "Successfully updated."}))
    .catch(error => response.status(400).json({ error }))
})

router.post('/', async (request, response) => {

    // First store the request body
    const { applicant_id, job_id } = request.body;

    try {
        let userExists = await User.findOne({ _id: applicant_id })
        if (!userExists) return response.status(400).json({ error: "User does not exist"})
    
        let jobExists = await Job.findOne({ _id: job_id })
        if (!jobExists) return response.status(400).json({ error: "Job does not exist"})
        if (!jobExists.open) return response.status(400).json({ error: "Job has been closed, you cannot apply to this job."})
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
        .then(result => response.status(200).json({ message: "You have successfully applied for this job." }))
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
            select: select.GET_APPLICATION_LIST
        })
        .sort('-createdAt')
        .then(results => response.status(200).json({ results }))
        .catch(error => response.status(400).json({ error }))
})

router.get('/list/employer', authMiddleware, async (request, response) => {
    
    // Check if the job belongs to the employer
    const { job_id } = request.query;
    if (!job_id) return response.status(400).json({ message: "Job_id was not supplied."})
    try {
        let jobExists = await Job.findOne({ _id: job_id })
        if (!jobExists) return response.status(400).json({ message: "This job does not exist" })
        if (String(jobExists.creator_id) !== request.user._id) return response.status(400).json({ message: "This job does not belong to you."}) 
    }
    catch {
        return response.status(400).json({ message: "Unknown error occured."})
    }

    // Return the results
    const query = { job_id }

    JobApplication.find(query)
    .populate({
            path: 'applicant_id',
            select: 'first_name last_name email'
    })
    .then(results => response.status(200).json({ results }))
    .catch(error => {
        return response.status(400).json({ message: "Failed to fetch the results"})
    })
})

module.exports = router;