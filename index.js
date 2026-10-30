const express = require("express");
const cors = require("cors");
const { checkConnection } = require("./utilities/dbConnection.js")
const jwt = require("jsonwebtoken");
const { validarCredenciales,
    validarToken,
    reportarConsulta
 } = require("./Controllers/middlewares.js")
const { crearUsuario, 
    verificarCredenciales, 
    obtenerUsuarios 
} = require("./Controllers/userController.js")

const app = express();

app.use(express.json());
app.use(cors());
app.use(reportarConsulta)

app.listen(3000, async ()=>{
    try{
    const hora = await checkConnection();
    console.log("Servidor encendido y arriba en http://localhost:3000 " + hora)

}catch(error){
    console.log("Error al encender el Servidor", error.message)
}
});

//RUTAS USUARIOS

app.post("/usuarios", async (req, res)=>{
    const { email, password, rol, lenguage } = req.body;
    try{
        const result = await crearUsuario(email, password, rol, lenguage);
        res.send(result);
    }catch(error){
        res.status(500).send("Error creando al usuario " + error.message);
    }

})

app.post("/login", validarCredenciales, async (req, res)=>{
    const { email, password } = req.body;
    try{
        await verificarCredenciales(email, password);
        const token = jwt.sign(
            { email, fecha: Date.now(), nombreApp: "SoftJobs" },
            "LLAVE_SUPERSECRETA",
        );
        res.send(token);
    }catch(error){
        res.status(error.code || 500).send(error.message)
}});

app.get("/usuarios", validarToken, async (req, res)=>{
    try{
        const usuario = await obtenerUsuarios(req.email);
        if(!usuario){
            return res.status(404).send("Usuario no encontrado");
        }
        const { password, ...datosUsuario } = usuario;
        res.json({datosUsuario});
    }
    catch(error){
        res.status(500).send("Error al obtener el usuario: " + error.message)
    }
})