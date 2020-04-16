const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@cluster0-hkxnt.mongodb.net/phonebook-app?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

// If only password is entered display persons.
if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
        process.exit(0)
    })
}

const addName = process.argv[3]
const addNumber = process.argv[4]

const person = new Person({
    name: addName,
    number: addNumber,
})

person.save().then(savedPerson => {
    console.log(`Saved ${savedPerson.name} with number ${savedPerson.number} to phonebook.`)
    mongoose.connection.close()
}) 