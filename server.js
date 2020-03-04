const express = require('express')
const app = express()
const mongoose = require('mongoose')
const rateLimit = require('express-rate-limit')
const cors = require('cors')

// Cross origin
app.use(cors())

// Rate limiter
// const limiter = rateLimit({
//     windowMs: 60 * 1000,
//     max: 200
// })
// app.use(limiter)

// Handle debug mode for mongoose
if (process.env.NODE_ENV !== 'PRODUCTION') {
    mongoose.set('debug', true)
    console.log('Mongoose debug mode has been switched on.')
} else { console.log('Mongoose Debug mode has been switched off.')}
     
// Connect to MongoDB via mongoose.
mongoose.connect('mongodb://localhost:27017/jobboard', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', function() {
    console.log('Successfully connected to MongoDB on localhost.')
})

// Json middleware
app.use(express.json())

// Routes
const jobRouter = require('./routes/job.route')
const skillRouter = require('./routes/skill.route')
const userRouter = require('./routes/user.route')
const benefitRouter = require('./routes/benefit.route')
const applicationRouter = require('./routes/application.route')
const categoryRouter = require('./routes/category.route')
const locationRouter = require('./routes/location.route')
const careerStatRouter = require('./routes/career_stat.route')
const newsRouter = require('./routes/news.route')
const feedbackRouter = require('./routes/feedback.route')
const documentationRouter = require('./routes/documentation.route')

app.use('/api/location', locationRouter)
app.use('/api/category', categoryRouter)
app.use('/api/skill', skillRouter)
app.use('/api/job', jobRouter)
app.use('/api/benefit', benefitRouter)
app.use('/api/application', applicationRouter)
app.use('/api/auth', userRouter)
app.use('/api/career-profile', careerStatRouter)
app.use('/api/news', newsRouter)
app.use('/api/feedback', feedbackRouter)
app.use('/api/documentation', documentationRouter)

const port = process.env.PORT || 3001

app.listen(port, ()=> {
    console.log(`Listening on port ${port}`)
})

