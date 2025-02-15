const config = require('../config/db') // Asegúrate de importar el archivo de configuración correctamente
const bcrypt = require('bcrypt') // Para encriptar contraseñas
const sql = require('mssql') // Importa la librería de SQL Server

// Obtener todos los usuarios
exports.getAllUsers = async () => {
  try {
    const pool = await sql.connect(config) // Usa la conexión a la base de datos
    const result = await pool
      .request() // Ahora usamos `pool.request()`
      .query('SELECT * FROM usuaris')
    console.log('✅ Datos obtenidos:', result.recordset)
    console.log('ddddddddddddddddddddddddddddddddddddddddddddddddddd')

    return result.recordset // Retorna los resultados directamente
  } catch (err) {
    throw new Error('Error al obtener usuarios: ' + err.message) // Lanza un error si ocurre
  }
}

/**
 * Obtener usuario por ID
 */
exports.getUserById = async (req, res) => {
  const { id } = req.params
  try {
    const pool = await sql.connect(config) // Usar la conexión con `pool`
    const result = await pool
      .request()
      .input('id', id)
      .query(
        'SELECT id, nom, correu, edat, nacionalitat, codiPostal, imatgePerfil FROM usuaris WHERE id = @id',
      )
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    res.json(result.recordset[0])
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

/**
 * Crear un nuevo usuario con contraseña encriptada
 */
exports.createUser = async (req, res) => {
  const {
    nom,
    correu,
    contrasenya,
    edat,
    nacionalitat,
    codiPostal,
    imatgePerfil,
  } = req.body

  // Hash de la contraseña antes de guardarla
  const hashedPassword = await bcrypt.hash(contrasenya, 10)

  try {
    const pool = await sql.connect(config) // Usar la conexión con `pool`
    const result = await pool
      .request()
      .input('nom', nom)
      .input('correu', correu)
      .input('contrasenya', hashedPassword) // Guardar la contraseña encriptada
      .input('edat', edat)
      .input('nacionalitat', nacionalitat)
      .input('codiPostal', codiPostal)
      .input('imatgePerfil', imatgePerfil)
      .query(
        'INSERT INTO usuaris (nom, correu, contrasenya, edat, nacionalitat, codiPostal, imatgePerfil) OUTPUT INSERTED.id VALUES (@nom, @correu, @contrasenya, @edat, @nacionalitat, @codiPostal, @imatgePerfil)',
      )

    res.status(201).json({
      id: result.recordset[0].id,
      nom,
      correu,
      edat,
      nacionalitat,
      codiPostal,
      imatgePerfil,
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

/**
 * Actualizar usuario
 */
exports.updateUser = async (req, res) => {
  const { id } = req.params
  const { nom, correu, edat, nacionalitat, codiPostal, imatgePerfil } = req.body

  try {
    const pool = await sql.connect(config) // Usar la conexión con `pool`
    const result = await pool
      .request()
      .input('id', id)
      .input('nom', nom)
      .input('correu', correu)
      .input('edat', edat)
      .input('nacionalitat', nacionalitat)
      .input('codiPostal', codiPostal)
      .input('imatgePerfil', imatgePerfil)
      .query(
        'UPDATE usuaris SET nom = @nom, correu = @correu, edat = @edat, nacionalitat = @nacionalitat, codiPostal = @codiPostal, imatgePerfil = @imatgePerfil WHERE id = @id',
      )

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    res.json({ message: 'Usuario actualizado correctamente' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

/**
 * Eliminar usuario
 */
exports.deleteUser = async (req, res) => {
  const { id } = req.params

  try {
    const pool = await sql.connect(config) // Usar la conexión con `pool`
    const result = await pool
      .request()
      .input('id', id)
      .query('DELETE FROM usuaris WHERE id = @id')

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json({ message: 'Usuario eliminado correctamente' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
