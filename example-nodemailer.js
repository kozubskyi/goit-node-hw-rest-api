const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
const path = require("path")
const fs = require("fs")

dotenv.config({ path: path.join(__dirname, ".env") })

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" // Эту строку кода нагуглил и добавил, поскольку без нее не отправлялись имейлы, выдавало ошибку. Вроде как антивирус что-то блокирует.

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER_EMAIL,
    pass: process.env.NODEMAILER_USER_PASS,
  },
})

async function main() {
  console.log(
    await transport.sendMail({
      from: process.env.NODEMAILER_USER_EMAIL,
      to: ["kozubskiy.denis@gmail.com", "kozubskiy.denis@mail.ru"],
      subject: "Nodemailer test email",
      html: "<h2>Email html page</h2>",
      attachments: [
        {
          filename: "100.jpg",
          encoding: "binary",
          content: await fs.promises.readFile(path.join(__dirname, "/public/avatars/2sb51kxkkrnezcgn.jpg")),
        },
      ],
    })
  )
}
main()
