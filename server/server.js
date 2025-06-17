require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error))

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})