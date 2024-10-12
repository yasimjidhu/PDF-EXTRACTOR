const express = require('express')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const uploadRoutes = require('./routes/uploadRoutes.js')
const authRoutes = require('./routes/auhRoutes.js')
const connectDB = require('./config/db.js')


const app = express()
app.use(express.json());  

const corsOptions = {
    origin: 'https://pdf-extractor-lovat.vercel.app', 
    credentials: true,
};

app.use(cors(corsOptions))

const uploadDir = path.join(__dirname,'uploads')
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir)
}

app.use('/pdf',uploadRoutes)
app.use('/auth',authRoutes)

app.use('/uploads',express.static(uploadDir))

const PORT = process.env.PORT  || 10000

connectDB()
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})