const JobApplication = require('../models/application.model');
const Job = require('../models/job.model');
const express = require('express');
const router = express.Router();
const select = require('../constants/select');
const authMiddleware = require('../middleware/auth.middleware');
const limit = require('../constants/limit')

/*
Update status of job applications (Employers and Seekers)
*/
router.patch('/', authMiddleware, async (request, response) => {
    const { _id, is_employer } = request.user
    const { job_id, status, applicant_id } = request.query;

    try {
        if (is_employer) {
            // Job must belong to Employer
            if (!applicant_id || !job_id || !status) return response.status(400).json({ error: 'A field has been omitted.'})
            const jobExists = await Job.findOne({ _id: job_id})
            if (!jobExists) return response.status(400).json({ error: "Job for this application does not exist."})
            if (String(jobExists.creator_id) !== _id) return response.status(400).json({ error: "Permission denied. Application does not belong to you."})
        } else {
            // Applicant must exist for Seeker
            if (!job_id || !status) return response.status(400).json({ error: 'A field has been omitted.A field has been omitted.'})
            const applicationExist = await JobApplication.findOne({ job_id, applicant_id: _id})
            if (!applicationExist) return response.status(400).json({ error: "Application does not exist or belong to you."})
        }
    } catch (e) {
        return response.status(400).json({ error: "Server error, something went wrong."})
    }
    
    // Continue with update
    const update = { status }
    const query = is_employer ? { applicant_id, job_id } : { applicant_id: _id, job_id}
    const options = { runValidators: true }
    JobApplication.findOneAndUpdate(query, update, options)
    .then(result => response.status(200).json({ message: "Successfully updated."}))
    .catch(error => response.status(400).json({ error }))
})

/*
Create applications (Seekers)
*/
router.post('/', authMiddleware, async (request, response) => {

    const { _id, is_employer} = request.user;
    if (is_employer) return response.status(400).json({ error: "You need to be logged in as a job seeker to apply."})
    const { job_id, user_message } = request.body;

    try {
        let jobExists = await Job.findOne({ _id: job_id })
        if (!jobExists) return response.status(400).json({ error: "Job does not exist"})
        if (!jobExists.open) return response.status(400).json({ error: "Job has been closed, you cannot apply to this job."})
        let applicationExists = await JobApplication.findOne({ applicant_id: _id, job_id})
        if (applicationExists) return response.status(400).json({ error: "You've already applied for this job."})
    }
    catch {
        return response.status(400).json({ error: "Invalid id."})
    }

    const application = new JobApplication({
        applicant_id: _id, 
        job_id, 
        user_message
    })
    
    application.save()
        .then(result => response.status(200).json({ message: "You have successfully applied for this job." }))
        .catch(error => response.status(400).json({ error }))
})

/*
Get applications list (Seeker)
*/
router.get('/list', authMiddleware, (request, response) => {
    const {_id} = request.user;
    const { page } = request.query; 
    
    let options = {
        sort: { createdAt: 'desc' },
        select: select.GET_APPLICATION_LIST,
        limit: limit.APPLICATION_LIST_DASHBOARD,
        populate: {
            path: 'job_id',
            select: select.GET_APPLICATION_LIST,
        },
    }

    if (page) options.page = page
    
    let query = { applicant_id: _id}

    JobApplication.paginate(query, options)
        .then(results => response.status(200).json({ results }))
        .catch(error => response.status(400).json({ error: "Failed to load applications." }))
})

/*
Get applications list (Employers)
*/
router.get('/list/employer', authMiddleware, async (request, response) => {
    
    const { _id } = request.user;
    // Check if the job belongs to the employer
    const { job_id, page } = request.query;
    if (!job_id) return response.status(400).json({ error: "Job_id was not supplied."})
    try {
        let jobExists = await Job.findOne({ _id: job_id })
        if (!jobExists) return response.status(400).json({ error: "This job does not exist" })
    }
    catch {
        return response.status(400).json({ error: "Unknown error occured."})
    }

    // Return the results
    const query = { job_id }
    let options = {
        sort: { createdAt: 'desc' },
        select: select.GET_APPLICATION_LIST,
        limit: limit.APPLICATION_LIST_DASHBOARD,
        populate: {
            path: 'applicant_id',
            select: select.GET_APPLICATION_LIST_EMPLOYER
        },
    }

    if (page) options.page = page

    JobApplication
    .paginate(query, options)
    .then(results => response.status(200).json({ results }))
    .catch(error => {
        return response.status(400).json({ error: "Failed to fetch the results"})
    })
})

module.exports = router;