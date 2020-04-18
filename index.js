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

app.get('/api/persons', (request, response, error) => {
    Person.find({})
        .then(persons => {
            response.json(persons.map(person => person.toJSON()))
        })
        .catch(error => next(error))
})

app.get('/api/info', (request, response, next) => {
    Person.countDocuments().then(response => {
        const date = new Date()
        return `Phonebook has info for ${response} people.<br><br>${date}`
    })
        .then(info => response.send(info))
        .catch(error => next(error))

})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
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

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformed id' })
    }

    next(error)
}

app.use(errorHandler)

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})