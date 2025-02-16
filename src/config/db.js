const sql = require('mssql')

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
}

sql
  .connect(config)
  .then(() => {
    console.log('Conexión a la base de datos exitosa')
  })
  .catch((err) => {
    console.log('Error al conectar con la base de datos:', err)
  })

module.exports = sql
