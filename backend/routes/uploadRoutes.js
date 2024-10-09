const express = require('express')
const upload = require('../config/multerConfig.js')
const uploadController = require('../controllers/pdfController.js')

const router = express.Router()

router.post('/',upload.single('pdfFile'),uploadController.uploadPdf)
router.post('/extract',uploadController.extractPages)

module.exports = router