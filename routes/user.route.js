const User = require('../models/user.model');
const express = require('express');
const settings = require('../settings');
const router = express.Router();
const bcrypt = require('bcrypt');


router.post('/register', async (request, response) => {
    
    // First check if the email is taken
    let user = await User.findOne({ email: request.body.email })

    if (user) return response.status(400).json({ error: "Email is already taken."})

    // Decontruct variables from the post body.
    const { email, password, first_name, last_name } = request.body;
    
    // Create a new User object
    user = new User({
        email, password, first_name, last_name
    })

    // Validate for errors
    let errors = await user.validate()
        .then(result => result)
        .catch(error => error)

    if (errors) return response.status(400).json({ errors})


    // Hash the password and save to database
    user.password = await bcrypt.hash(user.password, settings.bcrypt_iterations)
    await user.save();


    // Send response indicating success
    response.status(200).json({
        message: `Account created for ${user.email}`
    })
})

router.post('/login', async (request, response) => {
    
    const { email, password } = request.body;

    if (!email || !password) return response.status(400).json({error: "Username or password is missing."})

    let user = await User.findOne({ email })
        .then(result => result)
        .catch(error => error)
    
    if (!user) return response.status(400).json({ error: "Incorrect credentials were supplied."})

    let comparison = await bcrypt.compare(password, user.password)
        .then(result => result)
        .catch(error => error)

    if (!comparison) return response.status(400).json({ error: "Incorrect credentials were supplied."})

    const token = await user.makeToken();
    response.status(200).json({ token })

})

router.get('/', (request, response) => {
    User.find()
        .then(results => response.status(200).json({ results }))
        .catch(error => response.status(400).json({ error }))
})

module.exports = router;