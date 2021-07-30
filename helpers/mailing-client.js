const sgMail = require("@sendgrid/mail")

class MailingClient {
  async sendVerificationEmail(email, verificationToken) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const verificationLink = `${process.env.API_BASE_URL}/users/verify/${verificationToken}`

    return sgMail.send({
      from: process.env.SENDGRID_SENDER_EMAIL,
      to: email,
      subject: "Email verification needed",
      html: `<a href="${verificationLink}">Verify email</a>`,
    })
  }
}

module.exports.mailingClient = new MailingClient()
