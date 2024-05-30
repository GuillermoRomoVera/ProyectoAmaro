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

  router.get('/', (req, res) => {
    res.json({"message":"Probando API"});
  }); 

router.get("/lista", async (req,res,next)=>{
    sql ='SELECT * FROM personajes';
    if (typeof req.query.ID =='undefined'){
        connection.query(
            'SELECT * FROM personajes',
            function(err,result){
                (results.length == 0) ? res.status(404).send("not found") : console.log(results); res.send(results)
            });
    }
    else{    
    connection.query(
        'SELECT * FROM personajes WHERE ID =' + req.query.Id ,
        function(err,results){
            (results.length == 0) ? res.status(404).send("not found") : console.log(results); res.send(results);
            }
        )
    }
});

//Update
router.put("/actualizar", async (req, res) => {
    try {
        const {Id} = req.params;
        const {Nombre, Raza, Clase, Fuerza, Destreza, Constitucion, Inteligencia, Sabiduria, Carisma }=req.body;
        console.log(req.body);
        connection.query(
            'UPDATE `personajes` set `Nombre` =?, `Raza`=?, `Clase`=?,`Fuerza`=?,`Destreza`=?,`Constitucion`=?,`Inteligencia`=?,`Sabiduria`=?,`Carisma`=?',
            [Id, Nombre, Raza, Clase, Fuerza, Destreza, Constitucion, Inteligencia, Sabiduria, Carisma],
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
        [Id, Nombre, Raza, Clase, Fuerza, Destreza, Constitucion, Inteligencia, Sabiduria, Carisma],
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
        const {Id}=req.params;
        connection.query(
        sql =`DELETE FROM personajes WHERE ID = ?`,[Id],
        function(err,results){
        console.log(results); 
        res.status(201).send("Personaje eliminado con exito");
        })
    } catch(err){
        res.send(err.code+` / `+err.message);
    }
})
module.exports = router;