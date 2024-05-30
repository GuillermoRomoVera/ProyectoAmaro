const express = require("express");
const app = express();
const path = require('path');
const mysql = require("mysql2/promise");
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { SwaggerTheme, SwaggerThemeNameEnum } = require('swagger-themes');
const theme = new SwaggerTheme();

const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK)
  };

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API D&D',
            version: '1.0.0',
            description: 'Api que realiza un registro simple de personajes para el juego de mesa de D&D'
    },
        servers:[
            {url: "http://localhost:3000"}
        ], 
    },
    apis: [`${path.join(__dirname,"./Consultas.js")}`],
    };

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerDocs,options));

app.use("/api-docs-json",(req,res)=>{
    res.json(swaggerDocs);
})

app.use(express.json());

/**
 * @swagger
 * tags:
 * - name: Personajes
 *   description: Procesos de Alumnos
 * paths:
 *   /lista:
 *     get:
 *       tags:     
 *       - Personajes
 *       description: Lista de alumnos
 *       responses:
 *         200:
 *           description: Regresa a alumnos.
 *           type: json
 */
//Consulta
app.get("/lista", async (req,res,next)=>{
    sql ='SELECT * FROM personajes';
    if (typeof req.query.id !='undefined'){
    sql = sql + ` where id = "${req.query.id}"`;
    }

    try{
    connection =await mysql.createConnection({ host: 'roundhouse.proxy.rlwy.net', user:'root', database: 'railway', password: 'BJeuxTjJuwfhXSaolTreiTJqpiREPhAls'});
    var [rows,fields]=await connection.query(sql);
    connection.end();
    
    (rows.length > 0) ? res.send(rows) : res.status(404).json({Eror: "Datos no encontrados"});

}
catch(err){
        res.send(err.code+` / `+err.message);
    }
});

//Update
app.put("/actualizar", async (req, res) => {
    try {
        connection = await mysql.createConnection({ host: 'roundhouse.proxy.rlwy.net', user: 'root', database: 'railway', password: 'BJeuxTjJuwfhXSaolTreiTJqpiREPhAl' });
        sql =`UPDATE personajes SET id ="${req.query.idNuevo}"` + ` where id = "${req.query.id}"`;
        result= await connection.query(sql);
        await connection.end();
        if (result.affectedRows !==0) {
            res.status(200).json({ message: "Nombre actualizado con exito" });
        } else {
            res.status(404).json({ error: "No se encontró el nombre" });
        }
    } catch(err){
        res.send(err.code+` / `+err.message);
    }
});

//Añadir
app.post("/agregar", async (req, res) => {
    try {
        connection = await mysql.createConnection({ host: 'roundhouse.proxy.rlwy.net', user: 'root', database: 'railway', password: 'BJeuxTjJuwfhXSaolTreiTJqpiREPhAl' });
        sql =`INSERT INTO personajes (Nombre, Raza, Clase, Fuerza, Destreza, Constitucion, Inteligencia, Sabiduria, Carisma) VALUES ("${req.query.Nombre}","${req.query.Raza}","${req.query.Clase},"${req.query.Fuerza}","${req.query.Destreza}","${req.query.Constitucion}","${req.query.Inteligencia}","${req.query.Sabiduria}","${req.query.Carisma}")`;
        var [rows,fields] = await connection.query(sql);
        await connection.end();
        res.status(201).json({ message: "Nuevo Personaje agregado correctamente" });
    } catch(err){
        res.send(err.code+` / `+err.message);
    }
});

//Borrar
app.delete("/eliminar", async (req, res) =>{
    try{
        connection= await mysql.createConnection({ host: 'roundhouse.proxy.rlwy.net', user: 'root', database: 'railway', password: 'BJeuxTjJuwfhXSaolTreiTJqpiREPhAl' });
        sql =`DELETE FROM personajes WHERE id = "${req.query.id}"`; 
        var [rows,fields] = await connection.query(sql);
        await connection.end();
        res.status(201).json({ message: "Personaje eliminado con exito"});
    } catch(err){
        res.send(err.code+` / `+err.message);
    }
})

app.listen(3000,()=>{
    console.log("Servidor Express escuchando en puerto 3000");
});