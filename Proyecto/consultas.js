const express = require("express");
const app = express();
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { SwaggerTheme, SwaggerThemeNameEnum } = require('swagger-themes');
const theme = new SwaggerTheme();
require('dotenv').config({path: './config.env'});
const router=require('./endpoints/endpoints.js')
const PORT = process.env.PORT;

const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK)
  };

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API D&D',
            version: '2.0.0',
            description: 'Api que realiza un registro simple de personajes para el juego de mesa de D&D'
    },
        servers:[
            {url: "http://localhost:3000"}, {url: "https://proyectoamaro-production.up.railway.app/"}
        ], 
    },
    apis: [`${path.join(__dirname,"./consultas.js")}`],
    };

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerDocs,options));

app.use("/api-docs-json",(req,res)=>{
    res.json(swaggerDocs);
})

app.use(express.json());
app.use('/',router);
app.listen(PORT,()=>{
    console.log(`Servidor Express escuchando en puerto: ${PORT}`);
});