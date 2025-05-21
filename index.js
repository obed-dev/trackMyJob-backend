const path = require( 'path' );

const express = require("express");
require('dotenv').config(); //para leer las variables de entorno
const cors = require('cors');
const { dbConnection } = require('./database/config');







//crear el servidor de express
const app = express();


//base de datos     
dbConnection();

//CORS
app.use(cors());

//directorio publico
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

//lectura y parseo del body
app.use(express.json());

//rutas
//TODO: auth //crear, login, renew
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('*' , (req , res) => { 
     res.sendFile(path.join(__dirname, 'public/index.html'))
});

//CRUD: Eventos



//escuchar peticiones
app.listen(process.env.PORT , () => { 
     console.log(`Servidor corriendo en el puerto ${ process.env.PORT }`);
      

});