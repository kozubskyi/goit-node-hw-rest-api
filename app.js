const express = require("express")
const logger = require("morgan")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")
const mongoose = require("mongoose")

const contactsRouter = require("./routes/api/contacts")
const usersRouter = require("./routes/api/users")

const app = express()

dotenv.config({ path: path.join(__dirname, ".env") })

const formatsLogger = app.get("env") === "development" ? "dev" : "short"

async function initDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log("Database connection successful")
  } catch (err) {
    console.log("Error in DB connection:", err)
    process.exit(1)
  }
}
initDatabase()

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use("/api/contacts", contactsRouter)
app.use("/users", usersRouter)

app.use((req, res) => {
  res.status(404).json({ message: "Not found" })
})

app.use((err, req, res, next) => {
  res.status(err.status).json({ message: err.message })
})

module.exports = app
