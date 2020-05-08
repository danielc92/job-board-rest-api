require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")

// Handle debug mode for mongoose
if (process.env.NODE_ENV !== "PRODUCTION") {
  mongoose.set("debug", true)
  app.use(cors())
  console.log("Mongoose debug mode has been switched on.")
} else {
  console.log("Mongoose Debug mode has been switched off.")
}

// Connect to MongoDB via mongoose.
mongoose.connect("mongodb://localhost:27017/jobboard", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
const db = mongoose.connection
db.on("error", console.error.bind(console, "Connection error:"))
db.once("open", function () {
  console.log("Successfully connected to MongoDB on localhost.")
})

// Json middleware
app.use(express.json())

// Routes
const jobRouter = require("./routes/job.route")
const skillRouter = require("./routes/skill.route")
const userRouter = require("./routes/user.route")
const benefitRouter = require("./routes/benefit.route")
const applicationRouter = require("./routes/application.route")
const categoryRouter = require("./routes/category.route")
const locationRouter = require("./routes/location.route")
const careerStatRouter = require("./routes/career_stat.route")
const newsRouter = require("./routes/news.route")
const feedbackRouter = require("./routes/feedback.route")
const documentationRouter = require("./routes/documentation.route")
const statusRouter = require("./routes/status.route")

app.use("/api/location", locationRouter)
app.use("/api/category", categoryRouter)
app.use("/api/skill", skillRouter)
app.use("/api/job", jobRouter)
app.use("/api/benefit", benefitRouter)
app.use("/api/application", applicationRouter)
app.use("/api/auth", userRouter)
app.use("/api/career-profile", careerStatRouter)
app.use("/api/news", newsRouter)
app.use("/api/feedback", feedbackRouter)
app.use("/api/documentation", documentationRouter)
app.use("/api/status", statusRouter)

const port = process.env.PORT || 3001

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})


Sint anim id do commodo nisi nulla eu sit deserunt ut amet dolore laborum quis. Fugiat aute esse ipsum nostrud culpa minim laboris magna non sit. Consectetur sit dolore sit elit excepteur. Cupidatat sit quis nulla ipsum sint do eiusmod dolore. Voluptate ullamco veniam magna irure ad occaecat excepteur ullamco.