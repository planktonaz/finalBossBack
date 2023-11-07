const express = require('express')
const cors = require('cors')
const router = require('./router/mainRouter')
const mongoose = require('mongoose')


app = express()
require("dotenv").config()


mongoose.connect(process.env.DBKEY)
    .then(() => {
        console.log('CONNECTION SUCCESS')
    }).catch(e => {
    console.log('ERROR', e)
})


app.use(cors())
app.use(express.json())
app.use(express.static('public'));
app.use("/", router)


const port = 4001
app.listen(port)