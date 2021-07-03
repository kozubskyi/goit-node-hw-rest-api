const fs = require("fs")
const fsp = fs.promises
// const contacts = require("./contacts.json") // ? Зачем нужна эта переменная?
const uniqid = require("uniqid")

const path = require("path")
const contactsPath = path.join(__dirname, "/contacts.json")

const listContacts = async () => {
  try {
    const jsonContacts = await fsp.readFile(contactsPath, "utf-8")
    return JSON.parse(jsonContacts)
  } catch (err) {
    console.log(err)
  }
}

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts()
    return contacts.find((contact) => contact.id.toString() === contactId)
  } catch (err) {
    console.log(err)
  }
}

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts()
    const contactToDelete = contacts.find((contact) => contact.id.toString() === contactId)

    if (contactToDelete) {
      const newContacts = contacts.filter((contact) => contact.id.toString() !== contactId)
      fs.writeFile(contactsPath, JSON.stringify(newContacts), (err) => {
        if (err) throw err
        console.log("✅ Contact deleted successfully")
      })
    }

    return contactToDelete
  } catch (err) {
    console.log(err)
  }
}

const addContact = async ({ name, email, phone }) => {
  try {
    const contacts = await listContacts()
    const newContact = { id: uniqid(), name, email, phone }
    fs.writeFile(contactsPath, JSON.stringify([...contacts, newContact]), (err) => {
      if (err) throw err
      console.log("✅ Contact created successfully")
    })
    return newContact
  } catch (err) {
    console.log(err)
  }
}

const updateContact = async (contactId, { name, email, phone }) => {
  try {
    const contacts = await listContacts()
    const contactToUpdate = contacts.find((contact) => contact.id.toString() === contactId)

    if (contactToUpdate) {
      const updatedContact = {
        id: contactToUpdate.id,
        name: name || contactToUpdate.name,
        email: email || contactToUpdate.email,
        phone: phone || contactToUpdate.phone,
      }

      contacts.splice(contacts.indexOf(contactToUpdate), 1, updatedContact)

      fs.writeFile(contactsPath, JSON.stringify(contacts), (err) => {
        if (err) throw err
        console.log("✅ Contact updated successfully")
      })

      return updatedContact
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
