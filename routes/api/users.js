const router = require("express").Router()

const { authService } = require("../../services/auth.service")
const { validate } = require("../../helpers/validate")
const { catchWrapper } = require("../../helpers/catch-wrapper")
const { authorize } = require("../../helpers/authorize")
const { userSchema } = require("../../joi-schemas/user.joi-schema")
const { upload, compressImage } = require("../../helpers/multer")
const { validatePostVerifyBody } = require("../../helpers/users-validation")

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
    await authService.logout(req.user.email)

    res.status(204).send()
  })
)

router.patch(
  "/avatars",
  authorize,
  upload.single("avatar"),
  compressImage,
  catchWrapper(async (req, res, next) => {
    const avatarURL = await authService.updateAvatar(req)

    res.status(200).json({ avatarURL })
  })
)

router.get(
  "/verify/:verificationToken",
  catchWrapper(async (req, res, next) => {
    await authService.verifyEmail(req.params.verificationToken)

    res.status(200).json({ message: "Verification successful" })
  })
)

router.post(
  "/verify",
  validatePostVerifyBody,
  catchWrapper(async (req, res, next) => {
    await authService.sendOneMoreVerificationEmail(req.body.email)

    res.status(200).json({ message: "Verification email sent" })
  })
)

module.exports = router
