require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')

app.use(express.json())
app.use(cors())

app.use('/api', require('./routes/createUser'))
app.use('/api/posts', require('./routes/postRoutes'))
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/users", require("./routes/user"));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error))

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})