const multer = require("multer")
const uniqid = require("uniqid")
const path = require("path")
const Jimp = require("jimp")
const fs = require("fs")

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

async function compressImage(req, res, next) {
  const file = await Jimp.read(req.file.path)
  const filePath = req.file.path.replace(TMP_FILES_DIR_NAME, FILES_DIR_NAME)
  await file.resize(250, 250).quality(70).writeAsync(filePath)
  await fs.promises.unlink(req.file.path)
  req.file.destination = req.file.destination.replace(TMP_FILES_DIR_NAME, FILES_DIR_NAME)
  req.path = filePath

  next()
}

module.exports = {
  upload,
  compressImage,
}
