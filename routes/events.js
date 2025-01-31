// Events Routes
// /api/events

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt'); 
const { getEventos , crearEventos , actualizarEventos , eliminarEventos } = require('../controllers/events');   
const { isDate } = require('../helpers/isDate');        
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');



const router = Router();

//todas tienen que pasar por validarJWT 
router.use( validarJWT );


//obtener eventos
router.get('/',   getEventos);

//crear evento
router.post('/', 
    [ 
      check('title', 'El titulo es obligatorio').not().isEmpty(),
      check('start', 'Fecha de inicio es obligatorio').custom(isDate),
       check('end', 'Fecha de finalizacion es obligatorio').custom(isDate),

     validarCampos

    ],
    crearEventos);

//actualizar evento
router.put('/:id',  actualizarEventos);

//eliminar evento
router.delete('/:id',   eliminarEventos);


module.exports = router;





