require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()


const Person = require('./models/person')


morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))
app.use(express.json())

let persons = [
    {
        name: "Scooby Doo",
        number: "123-456-7890",
        id: 1,
    },
    {
        name: "Franky Roosevelt",
        number: "416-867-5309",
        id: 2,
    },
    {
        name: "Scooter Dog",
        number: "222-222-2223",
        id: 3,
    },
    {
        name: "Scrappy Do",
        number: "222-222-2224",
        id: 3,
    }
]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons.map(person => person.toJSON()))
    });
});

app.get('/api/info', (request, response) => {
    Person.countDocuments().then(response => {
        const date = new Date()
        return `Phonebook has info for ${response} people.<br><br>${date}`
    })
        .then(info => response.send(info))

})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    /* REMOVE DUP FUNCTIONALITY FOR NOW
const personExists = persons.find(person => person.name === body.name)

if (personExists) {
    return response.status(400).json({
        error: 'person already exists in phonebook'
    })
}
*/

    const person = new Person({
        name: request.body.name,
        number: request.body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    })

})

const unknownEndpoint = (request, response, next) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})