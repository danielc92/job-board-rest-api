# Job Board API
Building backend for a Job Board app in Nodejs, Express.js, MongoDB and mongoose. This application will be connected to a javascript based front-end such as React in the future.

### Security
- Appropriate rate limiting to prevent abuse, particularly to content (POST) creation routes.
- Passwords need to be slow hashed with `bcrypt/pbkf2`.
- Users should not and cannot modify documents created by others. May need to utlilize auth middleware to achieve this.
- Sensitive variables need to be hidden away in environment variables.

### Stack
- MongoDB as a database
- Mongoose ODM for modelling and validation
- Express.js for web framework
- Nodejs backend

### Available routes
- `/api/skill` (individual skills for jobs)
- `/api/job` (job postings)
- `/api/job-category` (job categories such as healthcare/retail/administration)
- `/api/benefit` (benefits relating to job posts)
- `/api/application` (applications)
- `/api/auth/login` (provided valid login details, will return a json web token)
- `/api/auth/register` (allows creation of new accounts)
- `/api/test` (for testing purposes only, not part of main application)

### Running the server 
`nodemon` can be installed to hot reload the server during development phase.

```sh
npm install nodemon
nodemon server.js
```

### Tests
- Testing all routes and methods using `postman`

### Deployment
Planning to deploy within Docker containers or barebone server on AWS/GCP/DO.

### Sources
- [Mongoose documentation](https://www.npmjs.com/package/mongoose)
- [Express.js documentation](https://expressjs.com/)
- [Basic rate limiting for express](https://www.npmjs.com/package/express-rate-limit)
- [Clustering in Node](https://nodejs.org/api/cluster.html)