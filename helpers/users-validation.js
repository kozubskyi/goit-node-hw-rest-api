const Joi = require("joi")

exports.validatePostVerifyBody = function (req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  })

  const { error } = schema.validate(req.body)

  if (error) return res.status(400).send({ message: "missing required field email" })

  next()
}
