const db = require('../config/db') // Se asume que tienes la configuración de DB separada

// Obtener todos los ítems
const getAllItems = (callback) => {
  const query = 'SELECT * FROM items'
  db.query(query, (err, results) => {
    if (err) {
      return callback(err, null)
    }
    callback(null, results)
  })
}

// Obtener un ítem por su ID (no implementdo)
const getItemById = (itemId, callback) => {
  const query = 'SELECT * FROM items WHERE id = ?'
  db.query(query, [itemId], (err, result) => {
    if (err) {
      return callback(err, null)
    }
    callback(null, result[0])
  })
}

// Agregar un nuevo ítem (no implementado)
const createItem = (itemData, callback) => {
  const { nombre, descripcion, precio } = itemData
  const query =
    'INSERT INTO items (nombre, descripcion, precio) VALUES (?, ?, ?)'
  db.query(query, [nombre, descripcion, precio], (err, result) => {
    if (err) {
      return callback(err, null)
    }
    callback(null, result.insertId)
  })
}

module.exports = { getAllItems, getItemById, createItem }
