const express = require('express')
const querystring = require('querystring')

const router = express.Router()

const AuthController = require('./auth.controller')
const EmailController = require('../email/email.controller')
/**
 * @apiDefine UserErrorResponse
 *
 * @apiErrorExample {json} Error-Response:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "err": Error
 *   }
 */

/**
 * @api {get} /api/v2/auth/test Test Route
 * @apiDescription
 * Test route to check if the API is properly connected
 *
 * @apiGroup Auth
 * @apiVersion 0.2.0
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 */
router.get('/test', (req, res) => {
  res.send('Auth App Works!')
})

/**
 * @api {post} /api/v2/auth/register Register
 * @apiDescription
 * Registers the user and saves them as a unverified
 * user it then sends an email to that user to verify
 *
 * @apiVersion 0.2.0
 *
 * @apiGroup Auth
 * @apiUse UserErrorResponse
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *         "email": String,
 *         "firstName": String,
 *         "lastName": String
 *         "graduationDate": Date
 *         "hasPaidDues": Boolean
 *         "verified": Boolean
 *     }
 *
 * @apiParam (Request body) {String} email email
 * @apiParam (Request body) {String} firstName first name
 * @apiParam (Request body) {String} lastName last name
 * @apiParam (Request body) {String} password password
 * @apiParam (Request body) {String} graduationDate graduation date
 */
router.post('/register', async (req, res) => {
  const authCtrl = new AuthController()
  const emailCtrl = new EmailController(req.protocol, req.headers.host)

  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    classification: req.body.classification,
    confirmEmailToken: null,
  }

  try {
    // Register the user
    const createdUser = await authCtrl.register(user)

    // Sending the email token
    await emailCtrl.sendConfirmationEmail(createdUser.email, createdUser.confirmEmailToken)

    res.status(201).json(createdUser)
  } catch (err) {
    console.error(err)
    res.status(500).json({ err: err.message })
  }
})

/**
 * @api {post} /api/v2/auth/login Login
 * @apiDescription
 * Logs in the user without OAuth2
 * Uses JWT Login/Authentication
 *
 * @apiVersion 0.2.0
 *
 * @apiGroup Auth
 * @apiUse UserErrorResponse
 *
 * @apiParam (Request body) {String} email email
 * @apiParam (Request body) {String} password password
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": String
 *       "user": {
 *         "email": String,
 *         "firstName": String,
 *         "lastName": String
 *         "graduationDate": Date
 *         "hasPaidDues": Boolean
 *         "verified": Boolean
 *       }
 *     }
 *
 */
router.post('/login', async (req, res) => {
  const ctrl = new AuthController()
  const { email, password } = req.body

  try {
    const { foundUser, token } = await ctrl.login(email, password)
    res.status(200).json({ token: `JWT ${token}`, user: foundUser })
  } catch (err) {
    console.error(err)
    res.status(err.code).json({ err })
  }
})

/**
 * @api {get} /api/v2/auth/confirm/:token Confirm User By Email
 * @apiDescription
 * Confirms the user has a valid email account.
 * Responses are in querystring
 *
 * @apiVersion 0.2.0
 *
 * @apiGroup Auth
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 302 OK
 *     {
 *       verify: "success"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 302 OK
 *     {
 *       err: "Error Validating Email"
 *     }
 *
 * @apiParam (Request body) {String} fallback URL to redirect when failure
 * @apiParam (Request body) {String} redirectURLSuccess URL to redirect when success
 * @apiParam (Request Params) {String} token Token in `confirmEmailToken`
 */
router.get('/confirm/:token', (req, res) => {
  const ctrl = new AuthController()
  const { token } = req.params
  const { redirectURLSuccess, fallback } = req.body
  ctrl.confirmToken(token)
    .then(() => {
      const qs = querystring.stringify({ verify: 'success' })
      res.redirect(302, `${redirectURLSuccess}/?${qs}`)
    })
    .catch(() => {
      const qs = querystring.stringify({ err: 'Error Validating Email' })
      res.redirect(302, `${fallback}/?${qs}`)
    })
})

/**
 * @api {post} /api/v2/auth/forgot Forgot Password
 * @apiDescription
 * Verifies that the user is resetting the password of an account they own
 *
 * @apiVersion 0.2.0
 *
 * @apiGroup Auth
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "email": String,
 *       "firstName": String,
 *       "lastName": String
 *       "graduationDate": Date
 *       "hasPaidDues": Boolean
 *       "verified": Boolean
 *     }
 *
 * @apiUse UserErrorResponse
 * @apiParam (Request body) {String} email email
 */
router.post('/forgot', async (req, res) => {
  try {
    const authCtrl = new AuthController()
    const emailCtrl = new EmailController(req.protocol, req.headers.host)

    const { user } = await authCtrl.forgotLogin(req.body.email)
    await emailCtrl.sendResetEmail(user.email, user.resetPasswordToken)

    res.status(200).json(user)
  } catch (err) {
    res.status(err.code).json({ msg: err.message })
  }
})

/**
 * @api {get} /api/v2/auth/reset/:token Reset Password - Email
 * @apiDescription
 * This endpoint is hit by an email to reset a user password
 * This endpoint is hit first in the sequence
 *
 * @apiVersion 0.2.0
 *
 * @apiGroup Auth
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 302 OK
 *     {
 *       "token": String
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 302 OK
 *     {
 *       "err": Error
 *     }
 *
 * @apiParam (Request body) {String} fallback URL to redirect when failure
 * @apiParam (Request body) {String} redirectURLSuccess URL to redirect when success
 * @apiParam (Request Params) {String} token Token in `confirmEmailToken`
 */
router.get('/reset/:token', async (req, res) => {
  const ctrl = new AuthController()
  const { token } = req.params
  const { redirectURLSuccess, fallback } = req.body
  try {
    const passToken = await ctrl.resetToken(token)
    const qs = querystring.stringify({ token: passToken })
    res.redirect(`${redirectURLSuccess}/?${qs}`)
  } catch (err) {
    const qs = querystring.stringify({ err })
    res.redirect(`${fallback}/?${qs}`)
  }
})

/**
 * @api {post} /api/v2/auth/reset/:token Reset Password - Client
 * @apiDescription
 * Client hits this endpoint with a token and a new password to update the account with
 *
 * @apiVersion 0.2.0
 *
 * @apiGroup Auth
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "email": String,
 *        "firstName": String,
 *        "lastName": String
 *        "graduationDate": Date
 *        "hasPaidDues": Boolean
 *        "verified": Boolean
 *     }
 *
 * @apiUse UserErrorResponse
 *
 * @apiParam (Request body) {String} password New Password
 * @apiParam (Request Params) {String} token Token in `resetPasswordToken`
 */
router.post('/reset/:token', async (req, res) => {
  try {
    const authCtrl = new AuthController()
    const emailCtrl = new EmailController(req.protocol, req.header.host)
    const { token } = req.params
    const { password } = req.body

    const user = await authCtrl.verifyUser(token, password)

    await emailCtrl.sendChangedPasswordEmail(user.email)

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ err })
  }
})

module.exports = router
