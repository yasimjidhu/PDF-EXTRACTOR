const express = require('express')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const uploadRoutes = require('./routes/uploadRoutes.js')


const app = express()
app.use(express.json());  

app.use(cors())

const uploadDir = path.join(__dirname,'uploads')
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir)
}


app.use('/upload',uploadRoutes)

app.use('/uploads',express.static(uploadDir))

const PORT = process.env.PORT  || 5000
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})