const sgMail = require("@sendgrid/mail")
const dotenv = require("dotenv")
const path = require("path")

dotenv.config({ path: path.join(__dirname, ".env") })

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const msg = {
  to: "kozubskiy.denis@gmail.com", // Change to your recipient
  from: process.env.NODEMAILER_USER_EMAIL,
  subject: "Sending with SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
}

sgMail
  .send(msg)
  .then(() => {
    console.log("Email sent")
  })
  .catch((error) => {
    console.error(error)
  })
