//Rutas de usuario
// http://localhost:4001/api/auth

const { Router } =  require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();
const upload = require('../middlewares/upload');
const { createUser , loginUser , renewToken , updateProfile } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');


router.post(
    "/register",
     [//middlewares
       check('name', 'El nombre es obligatorio').not().isEmpty(),
       check('email', 'El email es obligatorio').isEmail(),
       check('password', 'El password debe ser de 6 caracteres').isLength({min: 6}),
       validarCampos
     ] ,
      createUser);



router.post("/",
     [//middlewares
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de 6 caracteres').isLength({min: 6}),
        validarCampos

     ] ,
     loginUser);

router.put(
    "/profile",
    [
        validarJWT,
        upload.single('profileImage'), // El campo del form-data debe llamarse 'profileImage'
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        
        validarCampos
    ],
    updateProfile
);

router.get("/new", validarJWT ,renewToken);


module.exports = router;