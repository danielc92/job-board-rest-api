const express = require('express')
const router = express.Router()
const Feedback = require('../models/feedback.model')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/', authMiddleware, (request, response) => {
    const { message, category } = response.body
    const { _id } = request.user

    const feedback = new Feedback({
        message, category, user_id: _id
    })

    feedback.save()
        .then(result => response.status(200).json({message:'Successfully sent feedback, thank you.'}))
        .catch(error=>response.status(400).json({error: 'Failed to save feedback, please try again later.'}))

})
