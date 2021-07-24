const router = require("express").Router()
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

const { ContactModel } = require("../../model/contact.model")
const { catchWrapper } = require("../../helpers/catch-wrapper")

const notFoundObj = { message: "Not found" }

// Validation

function validatePostContactBody(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  })

  const { error } = schema.validate(req.body)

  if (error) return res.status(400).send({ message: `missing required ${error.details[0]?.context?.label} field` })

  next()
}

function validatePatchContactBody(req, res, next) {
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
  }).or("name", "email", "phone")

  const { error } = schema.validate(req.body)

  if (error) return res.status(400).send({ message: "missing fields" })

  next()
}

function validateIdParams(req, res, next) {
  const schema = Joi.object({
    contactId: Joi.objectId(),
  })

  const { error } = schema.validate(req.params)

  if (error) {
    return res.status(400).send({ message: `Bad Request. Contact with id ${error._original.contactId} nod found` })
  }

  next()
}

function validatePatchFavoriteBody(req, res, next) {
  const schema = Joi.object({
    favorite: Joi.boolean().required(),
  })

  const { error } = schema.validate(req.body)

  if (error) return res.status(400).send({ message: "missing field favorite" })

  next()
}

// Methods

router.get("/", async (req, res, next) => res.json(await ContactModel.find()))

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
  catchWrapper(async (req, res, next) => res.status(201).json(await ContactModel.create(req.body)))
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
