const Joi = require("joi")

exports.userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})
