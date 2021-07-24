const router = require("express").Router()
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

const { authService } = require("../../services/auth.service")
const { validate } = require("../../helpers/validate")
const { catchWrapper } = require("../../helpers/catch-wrapper")
const { authorize } = require("../../helpers/authorize")
const { userSchema } = require("../../schemas/user.schema")

router.post(
  "/signup",
  validate(userSchema),
  catchWrapper(async (req, res, next) => {
    const newUser = await authService.signup(req.body)
    const { email, subscription } = newUser

    res.status(201).json({ user: { email, subscription } })
  })
)

router.post(
  "/login",
  validate(userSchema),
  catchWrapper(async (req, res, next) => {
    const user = await authService.login(req.body)
    const { email, subscription, token } = user

    res.status(200).json({ token, user: { email, subscription } })
  })
)

router.get(
  "/current",
  authorize,
  catchWrapper(async (req, res, next) => {
    const { email, subscription } = req.user

    res.status(200).json({ email, subscription })
  })
)

router.post(
  "/logout",
  authorize,
  catchWrapper(async (req, res, next) => {
    await authService.logout(req.user)

    res.status(204).send()
  })
)

module.exports = router
