const sql = require('mssql') // Importa la librería para trabajar con SQL Server
const config = require('../config/db') // Configuración de la base de datos

/**
 * @swagger
 * /plants:
 *   get:
 *     summary: Obtener todas las plantas
 *     description: Esta ruta obtiene todas las plantas disponibles en la base de datos.
 *     responses:
 *       200:
 *         description: Lista de plantas obtenidas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID único de la planta.
 *                   usuari_id:
 *                     type: integer
 *                     description: ID del usuario propietario de la planta.
 *                   nom:
 *                     type: string
 *                     description: Nombre de la planta.
 *                   tipus:
 *                     type: string
 *                     description: Tipo de planta.
 *                   nivell:
 *                     type: integer
 *                     description: Nivel de la planta.
 *                   atac:
 *                     type: integer
 *                     description: Valor de ataque de la planta.
 *                   defensa:
 *                     type: integer
 *                     description: Valor de defensa de la planta.
 *                   velocitat:
 *                     type: integer
 *                     description: Valor de velocidad de la planta.
 *                   habilitat_especial:
 *                     type: string
 *                     description: Habilidad especial de la planta.
 *                   energia:
 *                     type: integer
 *                     description: Energía de la planta.
 *                   estat:
 *                     type: string
 *                     description: Estado de la planta.
 *                   raritat:
 *                     type: string
 *                     description: Raridad de la planta.
 *                   imatge:
 *                     type: string
 *                     description: URL de la imagen de la planta.
 *       500:
 *         description: Error en el servidor al obtener las plantas.
 */
exports.getAllPlants = async (req, res) => {
  try {
    const pool = await sql.connect(config) // Conexión a la base de datos
    const result = await pool.request().query('SELECT * FROM plantas') // Consulta SQL
    res.json(result.recordset) // Respuesta con las plantas obtenidas
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

/**
 * @swagger
 * /plants/{id}:
 *   get:
 *     summary: Obtener una planta por ID
 *     description: Esta ruta obtiene una planta específica basada en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la planta a obtener.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Planta obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID único de la planta.
 *                 usuari_id:
 *                   type: integer
 *                   description: ID del usuario propietario de la planta.
 *                 nom:
 *                   type: string
 *                   description: Nombre de la planta.
 *                 tipus:
 *                   type: string
 *                   description: Tipo de planta.
 *                 nivell:
 *                   type: integer
 *                   description: Nivel de la planta.
 *                 atac:
 *                   type: integer
 *                   description: Valor de ataque de la planta.
 *                 defensa:
 *                   type: integer
 *                   description: Valor de defensa de la planta.
 *                 velocitat:
 *                   type: integer
 *                   description: Valor de velocidad de la planta.
 *                 habilitat_especial:
 *                   type: string
 *                   description: Habilidad especial de la planta.
 *                 energia:
 *                   type: integer
 *                   description: Energía de la planta.
 *                 estat:
 *                   type: string
 *                   description: Estado de la planta.
 *                 raritat:
 *                   type: string
 *                   description: Raridad de la planta.
 *                 imatge:
 *                   type: string
 *                   description: URL de la imagen de la planta.
 *       404:
 *         description: Planta no encontrada.
 *       500:
 *         description: Error en el servidor al obtener la planta.
 */
exports.getPlantById = async (req, res) => {
  const { id } = req.params
  try {
    const pool = await sql.connect(config) // Conexión a la base de datos
    const result = await pool
      .request()
      .input('id', id)
      .query('SELECT * FROM plantas WHERE id = @id')
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Planta no encontrada' })
    }
    res.json(result.recordset[0])
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

/**
 * @swagger
 * /plants:
 *   post:
 *     summary: Crear una nueva planta
 *     description: Esta ruta permite crear una nueva planta en la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuari_id:
 *                 type: integer
 *                 description: ID del usuario propietario de la planta.
 *               nom:
 *                 type: string
 *                 description: Nombre de la planta.
 *               tipus:
 *                 type: string
 *                 description: Tipo de planta.
 *               nivell:
 *                 type: integer
 *                 description: Nivel de la planta.
 *               atac:
 *                 type: integer
 *                 description: Valor de ataque de la planta.
 *               defensa:
 *                 type: integer
 *                 description: Valor de defensa de la planta.
 *               velocitat:
 *                 type: integer
 *                 description: Valor de velocidad de la planta.
 *               habilitat_especial:
 *                 type: string
 *                 description: Habilidad especial de la planta.
 *               energia:
 *                 type: integer
 *                 description: Energía de la planta.
 *               estat:
 *                 type: string
 *                 description: Estado de la planta.
 *               raritat:
 *                 type: string
 *                 description: Raridad de la planta.
 *               imatge:
 *                 type: string
 *                 description: URL de la imagen de la planta.
 *     responses:
 *       201:
 *         description: Planta creada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID único de la nueva planta.
 *                 usuari_id:
 *                   type: integer
 *                   description: ID del usuario propietario de la planta.
 *                 nom:
 *                   type: string
 *                   description: Nombre de la planta.
 *                 tipus:
 *                   type: string
 *                   description: Tipo de planta.
 *                 nivell:
 *                   type: integer
 *                   description: Nivel de la planta.
 *                 atac:
 *                   type: integer
 *                   description: Valor de ataque de la planta.
 *                 defensa:
 *                   type: integer
 *                   description: Valor de defensa de la planta.
 *                 velocitat:
 *                   type: integer
 *                   description: Valor de velocidad de la planta.
 *                 habilitat_especial:
 *                   type: string
 *                   description: Habilidad especial de la planta.
 *                 energia:
 *                   type: integer
 *                   description: Energía de la planta.
 *                 estat:
 *                   type: string
 *                   description: Estado de la planta.
 *                 raritat:
 *                   type: string
 *                   description: Raridad de la planta.
 *                 imatge:
 *                   type: string
 *                   description: URL de la imagen de la planta.
 *       500:
 *         description: Error en el servidor al crear la planta.
 */
exports.createPlant = async (req, res) => {
  const {
    usuari_id,
    nom,
    tipus,
    nivell,
    atac,
    defensa,
    velocitat,
    habilitat_especial,
    energia,
    estat,
    raritat,
    imatge,
  } = req.body

  const query = `
    INSERT INTO plantas (usuari_id, nom, tipus, nivell, atac, defensa, velocitat, habilitat_especial, energia, estat, raritat, imatge)
    VALUES (@usuari_id, @nom, @tipus, @nivell, @atac, @defensa, @velocitat, @habilitat_especial, @energia, @estat, @raritat, @imatge);
  `

  try {
    const pool = await sql.connect(config) // Conexión a la base de datos
    const result = await pool
      .request()
      .input('usuari_id', usuari_id)
      .input('nom', nom)
      .input('tipus', tipus)
      .input('nivell', nivell)
      .input('atac', atac)
      .input('defensa', defensa)
      .input('velocitat', velocitat)
      .input('habilitat_especial', habilitat_especial)
      .input('energia', energia)
      .input('estat', estat)
      .input('raritat', raritat)
      .input('imatge', imatge)
      .query(query)

    res.status(201).json({
      id: result.recordset[0].id, // Ajuste para obtener el ID de la planta
      usuari_id,
      nom,
      tipus,
      nivell,
      atac,
      defensa,
      velocitat,
      habilitat_especial,
      energia,
      estat,
      raritat,
      imatge,
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

/**
 * @swagger
 * /plants/{id}:
 *   put:
 *     summary: Actualizar una planta
 *     description: Esta ruta permite actualizar una planta específica en la base de datos.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la planta a actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuari_id:
 *                 type: integer
 *                 description: ID del usuario propietario de la planta.
 *               nom:
 *                 type: string
 *                 description: Nombre de la planta.
 *               tipus:
 *                 type: string
 *                 description: Tipo de planta.
 *               nivell:
 *                 type: integer
 *                 description: Nivel de la planta.
 *               atac:
 *                 type: integer
 *                 description: Valor de ataque de la planta.
 *               defensa:
 *                 type: integer
 *                 description: Valor de defensa de la planta.
 *               velocitat:
 *                 type: integer
 *                 description: Valor de velocidad de la planta.
 *               habilitat_especial:
 *                 type: string
 *                 description: Habilidad especial de la planta.
 *               energia:
 *                 type: integer
 *                 description: Energía de la planta.
 *               estat:
 *                 type: string
 *                 description: Estado de la planta.
 *               raritat:
 *                 type: string
 *                 description: Raridad de la planta.
 *               imatge:
 *                 type: string
 *                 description: URL de la imagen de la planta.
 *     responses:
 *       200:
 *         description: Planta actualizada correctamente.
 *       404:
 *         description: Planta no encontrada.
 *       500:
 *         description: Error en el servidor al actualizar la planta.
 */
exports.updatePlant = async (req, res) => {
  const { id } = req.params
  const {
    usuari_id,
    nom,
    tipus,
    nivell,
    atac,
    defensa,
    velocitat,
    habilitat_especial,
    energia,
    estat,
    raritat,
    imatge,
  } = req.body

  const query = `
    UPDATE plantas
    SET usuari_id = @usuari_id,
        nom = @nom,
        tipus = @tipus,
        nivell = @nivell,
        atac = @atac,
        defensa = @defensa,
        velocitat = @velocitat,
        habilitat_especial = @habilitat_especial,
        energia = @energia,
        estat = @estat,
        raritat = @raritat,
        imatge = @imatge
    WHERE id = @id
  `

  try {
    const pool = await sql.connect(config) // Conexión a la base de datos
    const result = await pool
      .request()
      .input('id', id)
      .input('usuari_id', usuari_id)
      .input('nom', nom)
      .input('tipus', tipus)
      .input('nivell', nivell)
      .input('atac', atac)
      .input('defensa', defensa)
      .input('velocitat', velocitat)
      .input('habilitat_especial', habilitat_especial)
      .input('energia', energia)
      .input('estat', estat)
      .input('raritat', raritat)
      .input('imatge', imatge)
      .query(query)

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Planta no encontrada' })
    }
    res.json({ message: 'Planta actualizada correctamente' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

/**
 * @swagger
 * /plants/{id}:
 *   delete:
 *     summary: Eliminar una planta
 *     description: Esta ruta elimina una planta específica de la base de datos.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la planta a eliminar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Planta eliminada correctamente.
 *       404:
 *         description: Planta no encontrada.
 *       500:
 *         description: Error en el servidor al eliminar la planta.
 */
exports.deletePlant = async (req, res) => {
  const { id } = req.params
  const query = 'DELETE FROM plantas WHERE id = @id'

  try {
    const pool = await sql.connect(config) // Conexión a la base de datos
    const result = await pool.request().input('id', id).query(query)
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Planta no encontrada' })
    }
    res.json({ message: 'Planta eliminada correctamente' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
