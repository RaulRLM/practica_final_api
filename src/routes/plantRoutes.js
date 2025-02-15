const express = require('express')
const router = express.Router()
const plantController = require('../controllers/plantController') // Controlador de plantas

// Obtener todas las plantas
router.get('/', plantController.getAllPlants)

// Obtener una planta por ID
router.get('/:id', plantController.getPlantById)

// Crear una nueva planta
router.post('/', plantController.createPlant)

// Actualizar una planta
router.put('/:id', plantController.updatePlant)

// Eliminar una planta
router.delete('/:id', plantController.deletePlant)

module.exports = router
