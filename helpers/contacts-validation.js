const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

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

module.exports = {
  validatePostContactBody,
  validatePatchContactBody,
  validateIdParams,
  validatePatchFavoriteBody,
}
