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
                id: usuario.id,
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
                id: usuario.id,
                name: usuario.name,
                email: usuario.email,
                description: usuario.description,
                profileImage: usuario.profileImage,
                token 
            },
        
        
        );



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
 const usuario = await Usuario.findById(uid);

//generar un nuevo JWT y retornarlo en esta peticion

    const token = await generarJWT( uid, name );
    res.json({
      ok: true,
           user: {
            id: usuario.id,
            name: usuario.name,
            email: usuario.email,
            description: usuario.description, // <-- debe estar aquí
            profileImage: usuario.profileImage // <-- y aquí
        },
        token
        
        
    });
       console.log("renew token", usuario);
       
   
};


const updateProfile = async (req, res) => { 
    try {
        const userId = req.uid;
        

        const { name, description } = req.body;
        let updateData = { name, description };

        if (req.file) { 
            updateData.profileImage = req.file.path;
        }

        const user = await Usuario.findByIdAndUpdate(userId, updateData, { new: true });
        console.log("user updated:", user);

        res.json({
            ok: true,
              user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error actualizando perfil' });
    }
}




module.exports = {
    createUser,
    loginUser,
    renewToken,
    updateProfile
  }