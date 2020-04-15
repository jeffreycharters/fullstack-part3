const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
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
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    const date = new Date()
    const info = `Phonebook has info for ${persons.length} people.<br><br>${date}`
    response.send(info)

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
    const id = Math.floor(Math.random() * 10000000000)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const personExists = persons.find(person => person.name === body.name)

    if (personExists) {
        return response.status(400).json({
            error: 'person already exists in phonebook'
        })
    }

    const person = {
        id: id,
        name: request.body.name,
        number: request.body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

const unknownEndpoint = (request, response, next) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const port = process.env.port || 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})