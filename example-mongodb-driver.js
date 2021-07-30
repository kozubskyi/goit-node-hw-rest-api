const { MongoClient, ObjectId } = require("mongodb")

// Connection URL
// const url = "mongodb+srv://bc6example:09876zxcvb@cluster0.rngv6.mongodb.net/bc6example?retryWrites=true&w=majority"

// Database Name
const dbName = "bc6example"

const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

// Use connect method to connect to the server
// client.connect(function (err) {
//   assert.equal(null, err)
//   console.log("Connected successfully to server")

//   const db = client.db(dbName)

//   client.close()
// })

async function main() {
  await client.connect()
  console.log("Connected successfully to server")

  const db = client.db(dbName)
  const contacts = db.collection("contacts")

  //* 1. Create contact(s)

  // await contacts.insertOne({
  //   name: "test",
  //   email: "test@mail.com",
  //   phone: "099 000 00 00",
  //   age: 15,
  // })

  // await contacts.insertMany([
  //   {
  //     name: "test2",
  //     email: "test2@mail.com",
  //     phone: "099 000 00 00",
  //     age: 25,
  //   },
  //   {
  //     name: "test3",
  //     email: "test3@mail.com",
  //     phone: "099 000 00 00",
  //     age: 40,
  //     testKey: "value",
  //   },
  // ])

  //* 2. Get contact(s)

  // console.log(await contacts.find().toArray())

  console.log(await contacts.findOne({ _id: new ObjectId("60e9723622ed871a30ebedab") }))

  // console.log(await contacts.find({ name: "test2" }).toArray())

  // console.log(await contacts.find({ age: { $gte: 18, $lte: 50 } }).toArray())

  // console.log(await contacts.find({ email: /2\@mail.com/i }).toArray())

  // console.log(await contacts.find({ age: { $in: [10, 40] } }).toArray())

  //* 3. Update contact(s)

  // await contacts.updateMany({ name: "test3" }, { $set: { password: "updated" } })

  // await contacts.updateMany({}, { $inc: { age: 1 } })

  // await contacts.updateOne(
  //   { name: "test4" },
  //   { $set: { age: 50 }, $setOnInsert: { password: "upserted" } },
  //   { upsert: true }
  // )

  //* 4. Delete contact(s)

  // await contacts.deleteOne({ name: "test2" })
}
main()
