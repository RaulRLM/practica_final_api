const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController') // Asegúrate de que la ruta sea correcta

// Obtener todos los usuarios
//router.get('/', userController.getAllUsers) // Asegúrate de que 'getAllUsers' sea una función exportada en 'userController.js'

router.get('/', async (req, res) => {
  try {
    console.log('📌 Petición GET recibida en /usuaris')
    const users = await userController.getAllUsers()

    res.json(users) // ✅ Envía los datos correctamente
  } catch (error) {
    console.error('❌ Error en la ruta /usuaris:', error.message)
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
})
// Obtener un usuario por ID
router.get('/:id', userController.getUserById)

// Crear un nuevo usuario
router.post('/', userController.createUser)

// Actualizar un usuario
router.put('/:id', userController.updateUser)

// Eliminar un usuario
router.delete('/:id', userController.deleteUser)

module.exports = router
