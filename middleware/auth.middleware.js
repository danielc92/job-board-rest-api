const jwt = require('jsonwebtoken');
const settings = require('../settings');

module.exports = function(request, response, next) {

    // Grab the token from header
    const token = request.headers['x-access-token'];

    // Check if token exists
    if (!token) {
        return response.status(401).json({ error: "Access to this resource is denied, you need a token."})
    }

    // Attempt to verify token and set request.user 
    // If successful request object will have access to user details from makeToken method
    try {
        const decoded = jwt.verify(token, settings.token_secret);
        request.user = decoded;
        next();
    } catch (ex) {
        response.status(400).json({ error: "Invalid Token, try again."})
    }
}