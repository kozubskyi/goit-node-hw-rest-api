const router = require("express").Router()

const {
  validatePostContactBody,
  validatePatchContactBody,
  validateIdParams,
  validatePatchFavoriteBody,
} = require("../../helpers/contacts-validation")
const { ContactModel } = require("../../model/contact.model")
const { catchWrapper } = require("../../helpers/catch-wrapper")

const notFoundObj = { message: "Not found" }

router.get("/", async (req, res, next) => {
  res.json(await ContactModel.find())
})

router.get(
  "/:contactId",
  validateIdParams,
  catchWrapper(async (req, res, next) => {
    const contact = await ContactModel.findById(req.params.contactId)
    contact ? res.json(contact) : res.status(404).json(notFoundObj)
  })
)

router.post(
  "/",
  validatePostContactBody,
  catchWrapper(async (req, res, next) => {
    res.status(201).json(await ContactModel.create(req.body))
  })
)

router.delete(
  "/:contactId",
  validateIdParams,
  catchWrapper(async (req, res, next) =>
    (await ContactModel.findByIdAndDelete(req.params.contactId))
      ? res.status(200).json({ message: "contact deleted" })
      : res.status(404).json(notFoundObj)
  )
)

router.patch(
  "/:contactId",
  validateIdParams,
  validatePatchContactBody,
  catchWrapper(async (req, res, next) => {
    const updatedContact = await ContactModel.findByIdAndUpdate(req.params.contactId, req.body, { new: true })
    updatedContact ? res.json(updatedContact) : res.status(404).json(notFoundObj)
  })
)

router.patch(
  "/:contactId/favorite",
  validateIdParams,
  validatePatchFavoriteBody,
  catchWrapper(async (req, res, next) => {
    const updatedContact = await ContactModel.findByIdAndUpdate(req.params.contactId, req.body, { new: true })
    updatedContact ? res.json(updatedContact) : res.status(404).json(notFoundObj)
  })
)

module.exports = router
