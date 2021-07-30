const { Schema, model } = require("mongoose")

const contactSchema = new Schema({
  name: { type: String, required: [true, "Set name for contact"] },
  email: String,
  phone: String,
  favorite: { type: Boolean, default: false },
  owner: { type: Schema.Types.ObjectId, ref: "user" },
})

exports.ContactModel = model("Contact", contactSchema)
