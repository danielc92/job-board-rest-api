const User = require("../models/user.model")
const express = require("express")
const settings = require("../settings")
const router = express.Router()
const bcrypt = require("bcrypt")
const select = require("../constants/select")
const CareerStatModel = require("../models/career_stats.model")
const authMiddleware = require("../middleware/auth.middleware")
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")

/*
Create user
*/
router.post("/register", async (request, response) => {
  try {
    const { email, password, first_name, last_name, is_employer } = request.body

    // First check if the email is taken
    let user = await User.findOne({ email })
    if (user)
      return response.status(400).json({ error: "Email is already taken." })

    // Create a new User object
    user = new User({ email, password, first_name, last_name, is_employer })

    // Validate for errors
    let errors = await user
      .validate()
      .then((result) => result)
      .catch((error) => error)

    if (errors) return response.status(400).json({ errors })

    // Hash the password and save to database
    user.password = await bcrypt.hash(user.password, settings.bcrypt_iterations)
    await user.save()

    // Save career stat
    let career_stat = new CareerStatModel({
      user_id: user._id,
    })
    await career_stat.save()

    // Create token
    const token = user.makeResetToken()

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    })

    let mailOptions = {
      from: `${process.env.SENDER_NAME} <${process.env.GMAIL_USER}>`,
      to: `${user.email}`,
      subject: `Welcome to ${process.env.APPLICATION_NAME} ${user.first_name} ${user.last_name}`,
      html: `
            <div>
                <h2>Your new account on ${process.env.APPLICATION_NAME}</h2>
                <p>A new account was created with ${user.email}. Please verify your email. This activation link will expire in 1 hour.</p>
                    <a href="http://${process.env.REDIRECT_URL}/activate-account?token=${token}" style="margin: 16px 0px;padding: 0.4rem 1.5rem; background: #21ba45; color: white; border-radius: .28571429rem; text-decoration: none;">Verify</a>
                <p>If you didn't register for a ${process.env.APPLICATION_NAME} account you can safely ignore this message.</p>
            </div>`,
    }
    let result = await transporter.sendMail(mailOptions)
    // Send response indicating success
    response.status(200).json({
      message: `Account has been successfully created for ${user.email}. Please check your email inbox and activate your account before logging in.`,
    })
  } catch (error) {
    return response
      .status(400)
      .json({ error: "Something went wrong while creating your account" })
  }
})

// Sends an email with reset password link
router.post("/send-reset-password", async (request, response) => {
  const { email } = request.body

  try {
    const user = await User.findOne({ email })
    if (!user)
      return response.status(400).json({
        error: "Something went wrong please check that the email is correct.",
      })

    const token = user.makeResetToken()

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    })

    let mailOptions = {
      from: `${process.env.SENDER_NAME} <${process.env.GMAIL_USER}>`,
      to: `${email}`,
      subject: `Reset password link for ${email}`,
      html: `
            <div>
            <h2>Your password reset request</h2>
            <p>You told us you forgot your password. If you really did, click here to choose a new one.</p>
            <a href="http://${process.env.REDIRECT_URL}/reset-password?token=${token}" style="padding: 0.4rem 1.5rem; background: #21ba45; color: white; border-radius: .28571429rem; text-decoration: none;">Choose a new password</a>
            <p>If you didn't mean to reset your password, then you can just ignore this email. Your password will not change. This link will expire in 1 hour.</p>
            </div>`,
    }
    let result = await transporter.sendMail(mailOptions)

    return response.status(200).json({
      message:
        "Successfully sent reset password link, please check your email.",
    })
  } catch (error) {
    return response.status(400).json({
      error: "Something went wrong please check that the email is correct.",
    })
  }
})

// Resets the user password given a token, password
router.post("/reset-password", async (request, response) => {
  const { password, token } = request.body
  if (!password || !token)
    return response
      .status(400)
      .json({ error: "Error, Missing token or password." })
  try {
    const result = jwt.verify(token, process.env.BCRYPT_SECRET)
    const hashedPassword = await bcrypt.hash(
      password,
      settings.bcrypt_iterations
    )
    let user = await User.findById(result._id)
    user.password = hashedPassword
    await user.save()
    return response.status(200).json({
      message: "Successfully saved your new password, you can now login.",
    })
  } catch (e) {
    return response.status(400).json({
      error: "Something went wrong, the password reset link may have expired.",
    })
  }
})

router.post("/activate", (request, response) => {
  const { token } = request.query
  if (!token)
    return response
      .status(400)
      .json({ error: "No token provided, activation has failed." })

  try {
    const result = jwt.verify(token, process.env.BCRYPT_SECRET)

    User.findByIdAndUpdate({ _id: result._id }, { activated: true })
      .then((success) =>
        response
          .status(200)
          .json({ message: "Your account has been activated." })
      )
      .catch((error) =>
        response
          .status(400)
          .json({ error: "Sorry this activation link has expired or invalid." })
      )
  } catch (error) {
    return response
      .status(400)
      .json({ error: "Sorry this activation link has expired or invalid." })
  }
})

/*
Login user
*/
router.post("/login", async (request, response) => {
  const { email, password } = request.body

  if (!email || !password)
    return response
      .status(400)
      .json({ error: "Username or password is missing." })

  let user = await User.findOne({ email })
    .then((result) => result)
    .catch((error) => error)

  if (!user)
    return response
      .status(400)
      .json({ error: "Incorrect credentials were supplied." })

  if (!user.activated)
    return response.status(400).json({
      error:
        "Your account is not activated, please check your email for an activation link.",
    })
  let comparison = await bcrypt
    .compare(password, user.password)
    .then((result) => result)
    .catch((error) => error)

  if (!comparison)
    return response
      .status(400)
      .json({ error: "Incorrect credentials were supplied." })

  const token = await user.makeToken()
  response.status(200).json({ token })
})

/*
Get user detail (Employer)
*/
router.get("/", authMiddleware, async (request, response) => {
  const { id } = request.query

  User.findOne({ _id: id })
    .select(select.GET_USER)
    .then((results) => response.status(200).json({ results }))
    .catch((error) => response.status(400).json({ error }))
})

module.exports = router
