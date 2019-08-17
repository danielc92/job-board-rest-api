const User = require('../models/user.model');
const express = require('express');
const settings = require('../settings');
const router = express.Router();
const bcrypt = require('bcrypt');


router.post('/register', async (request, response) => {
    
    // First check if the email is taken
    let user = await User.findOne({ email: request.body.email })

    if (user) return response.status(400).json({ message: "Email provided has already been taken."})

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

    user.password = await bcrypt.hash(user.password, settings.bcrypt_iterations)
    await user.save();

    const token = user.makeToken();
    
    response.header(token).json({
        message: "Account has been created.",
        email: user.email,
        _id: user._id
    })
})

router.post('/login', (request, response) => {

})

router.get('/', (request, response) => {
    User.find()
        .then(results => response.status(200).json({ results }))
        .catch(error => response.status(400).json({ error }))
})

module.exports = router;