const sql = require('mssql')

const config = {
  user: 'raul',
  password: 'root1234!',
  server: 'spdvi2024sqlserverraul.database.windows.net',
  database: 'PlantesTEST',
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
