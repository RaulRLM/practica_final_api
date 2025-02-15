const express = require('express')
const router = express.Router()
const itemsController = require('../controllers/itemsController')

// Obtener todos los ítems
router.get('/', itemsController.getAllItems)

// Comprar ítems
router.post('/', itemsController.buyItems)

module.exports = router
