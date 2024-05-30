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
    apis: [`${path.join(__dirname, "./Consultas.js")}`],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs, options));

app.use("/api-docs-json", (req, res) => {
    res.json(swaggerDocs);
})

app.use(express.json());

// Consulta
app.get("/lista", async (req, res, next) => {
    let connection;
    let sql = 'SELECT * FROM personajes';
    if (typeof req.query.id !== 'undefined') {
        sql += ` WHERE id = "${req.query.id}"`;
    }

    try {
        connection = await mysql.createConnection(process.env.MYSQL_PRIVATE_URL);
        const [rows, fields] = await connection.query(sql);
        await connection.end();

        (rows.length > 0) ? res.send(rows) : res.status(404).json({ Error: "Datos no encontrados" });
    } catch (err) {
        res.status(500).send(err.code + ` / ` + err.message);
    }
});

// Update
app.put("/actualizar", async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(process.env.MYSQL_PRIVATE_URL);
        const sql = `UPDATE personajes SET id ="${req.body.idNuevo}" WHERE id = "${req.body.id}"`;
        const result = await connection.query(sql);
        await connection.end();
        if (result.affectedRows !== 0) {
            res.status(200).json({ message: "Nombre actualizado con éxito" });
        } else {
            res.status(404).json({ error: "No se encontró el nombre" });
        }
    } catch (err) {
        res.status(500).send(err.code + ` / ` + err.message);
    }
});

// Añadir
app.post("/agregar", async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(process.env.MYSQL_PRIVATE_URL);
        const sql = `INSERT INTO personajes (Nombre, Raza, Clase, Fuerza, Destreza, Constitucion, Inteligencia, Sabiduria, Carisma) VALUES ("${req.body.Nombre}","${req.body.Raza}","${req.body.Clase}","${req.body.Fuerza}","${req.body.Destreza}","${req.body.Constitucion}","${req.body.Inteligencia}","${req.body.Sabiduria}","${req.body.Carisma}")`;
        const [rows, fields] = await connection.query(sql);
        await connection.end();
        res.status(201).json({ message: "Nuevo Personaje agregado correctamente" });
    } catch (err) {
        res.status(500).send(err.code + ` / ` + err.message);
    }
});

// Borrar
app.delete("/eliminar", async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(process.env.MYSQL_PRIVATE_URL);
        const sql = `DELETE FROM personajes WHERE id = "${req.body.id}"`;
        const [rows, fields] = await connection.query(sql);
        await connection.end();
        res.status(201).json({ message: "Personaje eliminado con éxito" });
    } catch (err) {
        res.status(500).send(err.code + ` / ` + err.message);
    }
});


app.listen(3000, () => {
    console.log("Servidor Express escuchando en puerto 3000");
});
