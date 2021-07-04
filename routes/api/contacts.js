const express = require("express")
const Joi = require("joi")
const router = express.Router()

const { listContacts, getContactById, removeContact, addContact, updateContact } = require("../../model/index")

// Validation

function validatePostContactBody(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  })

  const { error } = schema.validate(req.body)

  if (error) return res.status(400).send({ message: `missing required ${error.details[0]?.context?.label} field` })

  next()
}

function validatePatchContactBody(req, res, next) {
  // if (Object.keys(req.body).length === 0) return res.status(400).send({ message: "missing fields" })

  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  }).or("name", "email", "phone")

  const { error } = schema.validate(req.body)

  if (error) return res.status(400).send({ message: "missing fields" })

  next()
}

// Methods

router.get("/", async (req, res, next) => res.json(await listContacts()))

router.get("/:contactId", async (req, res, next) => {
  const contact = await getContactById(req.params.contactId)
  contact ? res.json(contact) : res.status(404).json({ message: "Not found" })
})

router.post("/", validatePostContactBody, async (req, res, next) => res.status(201).json(await addContact(req.body)))

router.delete("/:contactId", async (req, res, next) =>
  (await removeContact(req.params.contactId))
    ? res.status(200).json({ message: "contact deleted" })
    : res.status(404).json({ message: "Not found" })
)

router.patch("/:contactId", validatePatchContactBody, async (req, res, next) => {
  const updatedContact = await updateContact(req.params.contactId, req.body)
  updatedContact ? res.json(updatedContact) : res.status(404).json({ message: "Not found" })
})

module.exports = router
