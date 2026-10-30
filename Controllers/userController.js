const { pool } = require("../utilities/dbConnection.js")
const bcrypt = require("bcryptjs");

async function crearUsuario(email, password, rol, lenguage) {
    try{
        const hashedPassword = await bcrypt.hashSync(password)
        const result = await pool.query(
            `INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)`,
            [email, hashedPassword, rol, lenguage],
        );
        return("Usuario creado con éxito!")
    }catch(error){
        throw error;
    }
}

async function verificarCredenciales(email, password){
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email])
    if(!result.rowCount) throw {code: 404, message: "No existe un usuario asociado al correo ingresado."}
    const user = result.rows[0]
    const hashedPassword = await bcrypt.compareSync(password, user.password) 
    if(!hashedPassword){
        throw{code: 401, message: "Contraseña incorrecta"}
    }
}

async function obtenerUsuarios(email){
    const result = await pool.query(
        "SELECT * FROM usuarios WHERE email = $1", [email]);
    return result.rows[0];
}

    module.exports = { crearUsuario, verificarCredenciales, obtenerUsuarios };