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
/**
 * @swagger
 * /lista:
 *   get:
 *     tags:
 *       - Registro de Personajes
 *     summary: Lista de Personajes
 *     parameters:
 *       - in: query
 *         name: id
 *         description: ID del Personaje
 *         schema:
 *           type: string
 *     remponses:
 *       200:
 *         description: Operacion exitosa
 *       400:
 *         description: No encontrado
 *       500:
 *         description: Error de conexion
 */
router.get("/lista", (req,res)=>{
    if (typeof req.query.Id =='undefined'){
        connection.query(
            'SELECT * FROM personajes',
            function(err,results){
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
router.put("/actualizar", (req, res) => {
    try {
        const { Id, Nombre, Raza, Clase, Fuerza, Destreza, Constitucion, Inteligencia, Sabiduria, Carisma } = req.body;
        console.log(req.body);
        connection.query(
            'UPDATE `personajes` SET `Nombre` = ?, `Raza` = ?, `Clase` = ?, `Fuerza` = ?, `Destreza` = ?, `Constitucion` = ?, `Inteligencia` = ?, `Sabiduria` = ?, `Carisma` = ? WHERE `Id` = ?',
            [Nombre, Raza, Clase, Fuerza, Destreza, Constitucion, Inteligencia, Sabiduria, Carisma, Id],
            function (err, results) {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error al actualizar el personaje");
                    return;
                }
                console.log(results);
                res.status(200).send("Personaje actualizado!");
            }
        );
    } catch (err) {
        res.status(500).send(err.code + ` / ` + err.message);
    }
});


//Añadir
router.post("/agregar", (req, res) => {
    try {
        const { Nombre, Raza, Clase, Fuerza, Destreza, Constitucion, Inteligencia, Sabiduria, Carisma } = req.body;
        console.log(req.body);
        connection.query(
            `INSERT INTO personajes (Nombre, Raza, Clase, Fuerza, Destreza, Constitucion, Inteligencia, Sabiduria, Carisma) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [Nombre, Raza, Clase, Fuerza, Destreza, Constitucion, Inteligencia, Sabiduria, Carisma],
            function (err, results) {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error al agregar el personaje");
                    return;
                }
                console.log(results);
                res.status(201).send("Nuevo Personaje agregado correctamente");
            }
        );
    } catch (err) {
        res.status(500).send(err.code + ` / ` + err.message);
    }
});


//Borrar
router.delete("/eliminar", (req, res) => {
    try {
        const { Id } = req.params;
        connection.query(
            'DELETE FROM personajes WHERE Id = ?',
            [Id],
            function (err, results) {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error al eliminar el personaje");
                    return;
                }
                console.log(results);
                res.status(200).send("Personaje eliminado con éxito");
            }
        );
    } catch (err) {
        res.status(500).send(err.code + ` / ` + err.message);
    }
});

 /**
 * @swagger
 * info:
 *   description: "API para la gestión de personajes de Dungeons & Dragons"
 *   version: "1.0.0"
 *   title: "DnD Personajes API"
 * host: "localhost:3000"
 * basePath: "/"
 * tags:
 *   - name: "personajes"
 *     description: "Operaciones CRUD para personajes"
 * 
 * schemes:
 *   - "http"
 *
 * paths:
 *   /lista:
 *     get:
 *       tags:
 *         - "personajes"
 *       summary: "Obtener lista de personajes"
 *       description: "Obtiene una lista de todos los personajes o un personaje específico por ID"
 *       parameters:
 *         - name: "Id"
 *           in: "query"
 *           description: "ID del personaje"
 *           required: false
 *           type: "integer"
 *       responses:
 *         200:
 *           description: "Lista de personajes obtenida con éxito"
 *           schema:
 *             type: "array"
 *             items:
 *               $ref: "#/schemas/Personaje"
 *         404:
 *           description: "Personaje no encontrado"
 *         500:
 *           description: "Error al obtener la lista de personajes"
 *
 *   /actualizar:
 *     put:
 *       tags:
 *         - "personajes"
 *       summary: "Actualizar un personaje"
 *       description: "Actualiza los detalles de un personaje existente"
 *       parameters:
 *         - in: "body"
 *          name: "body"
 *          description: "Detalles del personaje a actualizar"
 *          required: true
 *          schema:
 *            $ref: "#/schemas/Personaje"
 *     responses:
 *        200:
 *          description: "Personaje actualizado con éxito"
 *        500:
 *          description: "Error al actualizar el personaje"
 *
 *  /agregar:
 *    post:
 *      tags:
 *        - "personajes"
 *      summary: "Agregar un nuevo personaje"
 *      description: "Agrega un nuevo personaje a la base de datos"
 *      parameters:
 *        - in: "body"
 *          name: "body"
 *          description: "Detalles del nuevo personaje"
 *          required: true
 *          schema:
 *            $ref: "#/schemas/Personaje"
 *      responses:
 *        201:
 *          description: "Nuevo personaje agregado correctamente"
 *        500:
 *          description: "Error al agregar el personaje"
 *
 *  /eliminar/{Id}:
 *    delete:
 *      tags:
 *        - "personajes"
 *      summary: "Eliminar un personaje"
 *      description: "Elimina un personaje existente de la base de datos"
 *      parameters:
 *        - name: "Id"
 *          in: "path"
 *          description: "ID del personaje a eliminar"
 *          required: true
 *          type: "integer"
 *      responses:
 *        200:
 *          description: "Personaje eliminado con éxito"
 *        500:
 *          description: "Error al eliminar el personaje"
 *
 *schemas:
 *   Personaje:
 *    type: "object"
 *    required:
 *      - Nombre
 *      - Raza
 *      - Clase
 *      - Fuerza
 *      - Destreza
 *      - Constitucion
 *      - Inteligencia
 *      - Sabiduria
 *      - Carisma
 *    properties:
 *      Id:
 *        type: "integer"
 *        description: "ID autoincremental del personaje"
 *      Nombre:
 *        type: "string"
 *        description: "Nombre del personaje"
 *      Raza:
 *        type: "string"
 *        description: "Raza del personaje"
 *      Clase:
 *        type: "string"
 *        description: "Clase del personaje"
 *      Fuerza:
 *        type: "integer"
 *        description: "Fuerza del personaje"
 *      Destreza:
 *        type: "integer"
 *        description: "Destreza del personaje"
 *      Constitucion:
 *        type: "integer"
 *        description: "Constitución del personaje"
 *      Inteligencia:
 *        type: "integer"
 *        description: "Inteligencia del personaje"
 *      Sabiduria:
 *        type: "integer"
 *        description: "Sabiduría del personaje"
 *      Carisma:
 *        type: "integer"
 *        description: "Carisma del personaje"
 */


module.exports = router;