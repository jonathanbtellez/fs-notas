
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

app.get('/api/v1/note/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note)
    })
})

app.delete('/api/v1/note/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
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

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('server runnig in http://localhost:3001')
})

// "build:ui": "@powershell Remove-Item -Recurse -Force build && cd ../../osa2/materiaali/notes-new && npm run build && @powershell Copy-Item build -Recurse ../../../osa3/notes-backend/",
// Debbug
// node --inspect index.js