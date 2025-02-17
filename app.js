const express = require('express')
// Elimina la dependencia de mysql ya que no la estás utilizando
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

// Importa las configuraciones de la conexión a la base de datos
const db = require('./src/config/db')

const userRoutes = require('./src/routes/userRoutes')
const plantRoutes = require('./src/routes/plantRoutes')
const itemsRoutes = require('./src/routes/itemsRoutes')

const app = express()
const PORT = process.env.PORT || 3000

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'API Juego de Plantas',
      version: '1.0.0',
      description:
        'Documentació de la API per a gestionar plantes, usuaris, ítems, etc.',
    },
    servers: [
      {
        url: 'http://192.168.144.1:3000',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Rutas de los controladores
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)

// Rutas para servir la documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Configuración de middleware
app.use(cors())
app.use(bodyParser.json())

// Rutas
app.use('/usuaris', userRoutes) // Ruta para usuarios
app.use('/plantas', plantRoutes) // Ruta para plantas
app.use('/items', itemsRoutes) // Rutas de ítems
app.use('/items_usuaris', itemsRoutes) // Rutas de ítems

// Inicia el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})
