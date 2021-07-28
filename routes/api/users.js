const router = require("express").Router()
const multer = require("multer")
const uniqid = require("uniqid")
const path = require("path")
const Jimp = require("jimp")
const fs = require("fs")

const { authService } = require("../../services/auth.service")
const { validate } = require("../../helpers/validate")
const { catchWrapper } = require("../../helpers/catch-wrapper")
const { authorize } = require("../../helpers/authorize")
const { userSchema } = require("../../joi-schemas/user.joi-schema")

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

const TMP_FILES_DIR_NAME = "tmp"
const FILES_DIR_NAME = "public/avatars"

const upload = multer({
  storage: multer.diskStorage({
    destination: TMP_FILES_DIR_NAME,
    filename: (req, file, cb) => {
      const filename = uniqid() + path.extname(file.originalname)
      cb(null, filename)
    },
  }),
})

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

async function compressImage(req, res, next) {
  const file = await Jimp.read(req.file.path)
  const filePath = req.file.path.replace(TMP_FILES_DIR_NAME, FILES_DIR_NAME)
  await file.resize(250, 250).quality(70).writeAsync(filePath)
  await fs.promises.unlink(req.file.path)
  req.file.destination = req.file.destination.replace(TMP_FILES_DIR_NAME, FILES_DIR_NAME)
  req.path = filePath

  next()
}

module.exports = router
