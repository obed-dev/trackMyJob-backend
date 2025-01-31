const {response} = require('express');
const Usuario = require('../models/Usuario');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {
   
const { email , password } = req.body;

     try {

           let usuario = await Usuario.findOne( { 
                  email    
                })
             
           console.log(usuario);
            
             if ( usuario ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El usuario ya existe con ese correo'
                });
                
             }

            usuario = new Usuario( req.body );

            // Encriptar contraseña
            const salt = bcrypt.genSaltSync();
            usuario.password = bcrypt.hashSync( password, salt );


            await usuario.save();

            //generar JWT
            const token = await generarJWT( usuario.id, usuario.name );




            res.status(201).json({
                ok: true,
                msg: 'register',
                uuid: usuario.id,
                name: usuario.name,
                token
               
            });
                
     } catch (error) {
         res.status(500).json({
             ok: false,
             msg: 'Por favor hable con el administrador'
         });        
     } 



};


const loginUser = async (req, res = response ) => {
   
    const { email , password } = req.body;

 
      try {
        
        let usuario = await Usuario.findOne( { 
            email    
          })
       
     
      
       if ( !usuario ) {
          return res.status(400).json({
              ok: false,
              msg: 'El usuario no existe con ese correo'
          });
          
       }
        //confirmar los passwords
    const validPassword = bcrypt.compareSync( password, usuario.password );

    if ( !validPassword ) {
        return res.status(400).json({
            ok: false,
            msg: 'Password incorrecto'
        });
    }
       
      // Generar nuestro JWT
    const token = await generarJWT( usuario.id, usuario.name );


  
        res.json({
            ok: true,
            msg: 'login',
            uuid: usuario.id,
            name: usuario.name,
            email: usuario.email,
            token 
        
        });



      } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
        
      }
       
    
      


};


const renewToken = async (req, res = response) => {
   
  
   const { uid, name } = req;

//generar un nuevo JWT y retornarlo en esta peticion

    const token = await generarJWT( uid, name );
    res.json({
        ok: true,
        token
        
    });
       
   
};


module.exports = {
    createUser,
    loginUser,
    renewToken
  }