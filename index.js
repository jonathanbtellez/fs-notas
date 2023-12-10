
// let use enviroment variables
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()


const Note = require('./models/note')

// Let use the front and back in the same repo
app.use(express.static('build'))
// Let access to the cody in the request
app.use(express.json())

// Solve cors problem
app.use(cors())

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/v1/notes', (request, response) => {
    // Get all notes
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/v1/notes/:id', (request, response, next) => {
    Note.findById(request.params.id).then(note => {
        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
    }).catch(error => next(error))
})

app.put('/api/v1/notes/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

app.delete('/api/v1/notes/:id', (request, response) => {
    Note.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})


app.post('/api/v1/notes', (request, response) => {
    const body = request.body

    if (body.content === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// Error handler
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

// Use error handler
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('server runnig in http://localhost:3001')
})

// "build:ui": "@powershell Remove-Item -Recurse -Force build && cd ../../osa2/materiaali/notes-new && npm run build && @powershell Copy-Item build -Recurse ../../../osa3/notes-backend/",
// Debbug
// node --inspect index.js