const db = require('../config/db')
const sql = require('mssql') // Importamos la librería MSSQL

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Obtener todos los ítems
 *     description: Esta ruta obtiene todos los ítems disponibles en la base de datos.
 *     responses:
 *       200:
 *         description: Lista de ítems obtenidos correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID único del ítem.
 *                   nombre:
 *                     type: string
 *                     description: Nombre del ítem.
 *                   tipo:
 *                     type: string
 *                     description: Tipo de ítem.
 *                   descripcion:
 *                     type: string
 *                     description: Descripción del ítem.
 *       500:
 *         description: Error en el servidor al obtener los ítems.
 */
const getAllItems = async (req, res) => {
  try {
    const pool = await sql.connect(db) // Conectar a la base de datos MSSQL
    const result = await pool.request().query('SELECT * FROM items')
    res.json(result.recordset) // Devuelve los ítems obtenidos
    console.log(result.recordset)
  } catch (err) {
    console.error('Error en la consulta de ítems:', err)
    res.status(500).json({ error: err.message })
  }
}

/**
 * @swagger
 * /items_usuaris:
 *   post:
 *     summary: Comprar ítems
 *     description: Permet a un usuari comprar ítems. Si l'usuari ja té un ítem, s'actualitza la quantitat en lloc de duplicar-lo. A més, es descompta el cost total del saldo en BTC de l'usuari.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: L'ID de l'usuari que realitza la compra.
 *               items:
 *                 type: array
 *                 description: Llista d'ítems a comprar.
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemId:
 *                       type: integer
 *                       description: L'ID de l'ítem comprat.
 *                     quantitat:
 *                       type: integer
 *                       description: La quantitat d'ítems comprats.
 *               totalCost:
 *                 type: number
 *                 format: float
 *                 description: El cost total de la compra en BTC.
 *     responses:
 *       200:
 *         description: Compra realitzada amb èxit.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la compra ha estat exitosa.
 *                 message:
 *                   type: string
 *                   description: Missatge que confirma l'èxit de la compra.
 *       400:
 *         description: Error en la compra (saldo insuficient, usuari no trobat, etc.).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la compra ha fallat.
 *                 error:
 *                   type: string
 *                   description: Missatge amb el motiu de l'error.
 *       500:
 *         description: Error intern del servidor.
 */
const buyItems = async (req, res) => {
  const { userId, items, totalCost } = req.body

  if (!Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ success: false, error: 'La lista de ítems es inválida' })
  }

  try {
    const pool = await sql.connect(db) // Conectar a la base de datos MSSQL

    // 1️⃣ Verificar si el usuario existe
    const usuarioResult = await pool
      .request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM usuaris WHERE id = @userId')

    if (usuarioResult.recordset.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: 'Usuario no encontrado' })
    }

    const usuario = usuarioResult.recordset[0]

    // 2️⃣ Verificar saldo suficiente
    if (usuario.btc < totalCost) {
      throw new Error('Saldo insuficiente')
    }

    // 3️⃣ Restar BTC del usuario
    await pool
      .request()
      .input('totalCost', sql.Float, totalCost)
      .input('userId', sql.Int, userId)
      .query('UPDATE usuaris SET btc = btc - @totalCost WHERE id = @userId')

    // 4️⃣ Insertar o actualizar los ítems comprados
    for (const item of items) {
      const itemResult = await pool
        .request()
        .input('userId', sql.Int, userId)
        .input('itemId', sql.Int, item.itemId)
        .input('quantitat', sql.Int, item.quantitat).query(`
          IF EXISTS (SELECT 1 FROM items_usuaris WHERE usuari_id = @userId AND item_id = @itemId)
            UPDATE items_usuaris SET quantitat = quantitat + @quantitat WHERE usuari_id = @userId AND item_id = @itemId
          ELSE
            INSERT INTO items_usuaris (usuari_id, item_id, quantitat) VALUES (@userId, @itemId, @quantitat)
        `)
    }

    res.json({ success: true, message: 'Compra realizada con éxito' })
  } catch (error) {
    console.error('Error en la compra:', error.message)
    res.status(400).json({ success: false, error: error.message })
  }
}

module.exports = { getAllItems, buyItems }
