const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log(url)
        console.log('error connecting to MongoDB:', error.message)
    })

// Create a schema to save an specify data
const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

// Set a custom schema rsponse
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// Bind data with modal and export
module.exports = mongoose.model('Note', noteSchema)