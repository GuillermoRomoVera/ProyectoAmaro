const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
require('dotenv').config({path: '../config.env'});

const HOST = process.env.MYSQLHOST;
const USER = process.env.MYSQLUSER;
const DB = process.env.MYSQLDATABASE;
const PORTE = process.env.MYSQLPORT;
const PASSWORD = process.env.MYSQL_ROOT_PASSWORD;

console.log(`host:${HOST}, user: ${USER}, password: ${PASSWORD}, database: ${DB}. port ${PORTE}`)

const connection = mysql.createConnection({
    host: HOST,
    user: USER,
    database: DB,
    port: PORTE,
    password: PASSWORD
  });


router.get("/lista", async (req,res,next)=>{
    sql ='SELECT * FROM personajes';
    if (typeof req.query.ID =='undefined'){
        connection.query(
            sql,
            function(err,result){
                (rows.length > 0) ? res.send(rows) : res.status(404).json({Eror: "Datos no encontrados"});
            }
        )
    }
    else{    
    connection.query(
        sql + 'WHERE ID =' + req.query.ID ,
        function(err,result){
            (rows.length > 0) ? res.send(rows) : res.status(404).json({Eror: "Datos no encontrados"});
            }
        )
    }
});

//Update
router.put("/actualizar", async (req, res) => {
    try {
        const {ID} = req.params;
        const {Nombre, Raza, Clase, Fuerza, Destreza, Constitucion, Inteligencia, Sabiduria, Carisma }=req.body;
        console.log(req.body);
        connection.query(
            'UPDATE `personajes` set `Nombre` =?, `Raza`=?, `Clase`=?,`Fuerza`=?,`Destreza`=?,`Constitucion`=?,`Inteligencia`=?,`Sabiduria`=?,`Carisma`=?',
            [ID, Nombre, Raza, Clase, Fuerza, Destreza, Constitucion, Inteligencia, Sabiduria, Carisma],
            function(err,results){
                console.log(results);
                res.status(200).send("Personaje actualizado!");
            })
    } catch(err){
        res.send(err.code+` / `+err.message);
    }
});

//Añadir
router.post("/agregar", async (req, res) => {
    try {
        const {Nombre, Raza, Clase, Fuerza, Destreza, Constitucion, Inteligencia, Sabiduria, Carisma }=req.body;
        console.log(req.body);
        connection.query(
        `INSERT INTO personajes (Nombre, Raza, Clase, Fuerza, Destreza, Constitucion, Inteligencia, Sabiduria, Carisma) VALUES (?,?,?,?,?,?,?,?,?)`
        [ID, Nombre, Raza, Clase, Fuerza, Destreza, Constitucion, Inteligencia, Sabiduria, Carisma],
        function(err,results){
            console.log(results);
        res.status(201).send("Nuevo Personaje agregado correctamente");
        })
    } catch(err){
        res.send(err.code+` / `+err.message);
    }
});

//Borrar
router.delete("/eliminar", async (req, res) =>{
    try{
        const {ID}=req.params;
        connection.query(
        sql =`DELETE FROM personajes WHERE ID = ?`,[ID],
        function(err,results){
        console.log(results); 
        res.status(201).send("Personaje eliminado con exito");
        })
    } catch(err){
        res.send(err.code+` / `+err.message);
    }
})
module.exports = router;