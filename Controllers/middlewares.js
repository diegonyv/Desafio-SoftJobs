const jwt = require("jsonwebtoken");

function validarCredenciales(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("Debe ingresar email y password");
    }
    next();
}

function validarToken(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1];
    if(!token){
        return res.status(401).send("Token no proporcionado");
    }
    try{
        const decoded = jwt.verify(token, "LLAVE_SUPERSECRETA");
        req.email = decoded.email;
        next();
    }catch(error){
        return res.status(401).send("Token inválido")
    }
}

function reportarConsulta(req, res, next) {
    console.log(
        "Reporte de Consulta: " + `${new Date().toLocaleString()} - ${req.method} ${req.url}`
    );
    next();
}

module.exports = { validarCredenciales, validarToken, reportarConsulta };