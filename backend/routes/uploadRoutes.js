const express = require('express')
const upload = require('../config/multerConfig.js')
const uploadController = require('../controllers/pdfController.js')
const {protect} = require('../middlewares/authMiddleware.js')

const router = express.Router()

router.post('/',protect,upload.single('pdfFile'),uploadController.uploadPdf)
router.get('/:userId',protect,uploadController.getMyPdfs)
router.post('/extract',protect,uploadController.extractPages)

module.exports = router