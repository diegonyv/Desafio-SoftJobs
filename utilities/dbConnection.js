const { Pool } = require("pg")

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "Rt183754807",
    database: "softjobs",
    allowExistOnIdle: true
})

async function checkConnection() {
    const result = await pool.query("SELECT NOW()")
    const hora = result.rows[0].now
    return hora
}

module.exports = {pool, checkConnection}