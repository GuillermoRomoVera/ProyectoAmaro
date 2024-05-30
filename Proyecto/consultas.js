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
        servers: [
            { url: "http://localhost:3000" }
        ],
    },
    apis: [`${path.join(__dirname, "./consultas.js")}`],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs, options));

app.use("/api-docs-json", (req, res) => {
    res.json(swaggerDocs);
});

const PORT = process.env.PORT;
const PORTE = process.env.MYSQLPORT;
const HOST = process.env.MYSQLHOST;
const USER = process.env.MYSQLUSER;
const PASSWORD = process.env.MYSQL_ROOT_PASSWORD;
const DATABASE = process.env.MYSQL_DATABASE;

app.use(express.json());

/**
 * @swagger
 * tags:
 *   name: Personajes
 *   description: Procesos de Alumnos
 * /lista:
 *   get:
 *     tags:
 *       - Personajes
 *     description: Lista de alumnos
 *     responses:
 *       200:
 *         description: Regresa a alumnos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
app.get("/lista", async (req, res, next) => {
    let sql = 'SELECT * FROM personajes';
    if (req.query.id) {
        sql += ' WHERE id = ?';
    }

    try {
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            database: DATABASE,
            password: PASSWORD
        });

        const [rows, fields] = await connection.execute(sql, [req.query.id]);
        connection.end();

        if (rows.length > 0) {
            res.send(rows);
        } else {
            res.status(404).json({ error: "Datos no encontrados" });
        }
    } catch (err) {
        res.send(err.code + ` / ` + err.message);
    }
});

// Update
app.put("/actualizar", async (req, res) => {
    try {
        const connection = await mysql.createConnection({
            host: 'roundhouse.proxy.rlwy.net',
            user: 'root',
            database: 'railway',
            password: 'BJeuxTjJuwfhXSaolTreiTJqpiREPhAl'
        });

        const sql = 'UPDATE personajes SET id = ? WHERE id = ?';
        const [result] = await connection.execute(sql, [req.query.idNuevo, req.query.id]);
        await connection.end();

        if (result.affectedRows !== 0) {
            res.status(200).json({ message: "Nombre actualizado con éxito" });
        } else {
            res.status(404).json({ error: "No se encontró el nombre" });
        }
    } catch (err) {
        res.send(err.code + ` / ` + err.message);
    }
});

// Añadir
app.post("/agregar", async (req, res) => {
    try {
        const connection = await mysql.createConnection({
            host: 'roundhouse.proxy.rlwy.net',
            user: 'root',
            database: 'railway',
            password: 'BJeuxTjJuwfhXSaolTreiTJqpiREPhAl'
        });

        const sql = 'INSERT INTO personajes (Nombre, Raza, Clase, Fuerza, Destreza, Constitucion, Inteligencia, Sabiduria, Carisma) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [req.query.Nombre, req.query.Raza, req.query.Clase, req.query.Fuerza, req.query.Destreza, req.query.Constitucion, req.query.Inteligencia, req.query.Sabiduria, req.query.Carisma];
        const [rows, fields] = await connection.execute(sql, values);
        await connection.end();

        res.status(201).json({ message: "Nuevo Personaje agregado correctamente" });
    } catch (err) {
        res.send(err.code + ` / ` + err.message);
    }
});

// Borrar
app.delete("/eliminar", async (req, res) => {
    try {
        const connection = await mysql.createConnection({
            host: 'roundhouse.proxy.rlwy.net',
            user: 'root',
            database: 'railway',
            password: 'BJeuxTjJuwfhXSaolTreiTJqpiREPhAl'
        });

        const sql = 'DELETE FROM personajes WHERE id = ?';
        const [rows, fields] = await connection.execute(sql, [req.query.id]);
        await connection.end();

        res.status(201).json({ message: "Personaje eliminado con éxito" });
    } catch (err) {
        res.send(err.code + ` / ` + err.message);
    }
});

app.listen(PORTE, () => {
    console.log("Servidor Express escuchando en puerto: "+PORTE);
});
