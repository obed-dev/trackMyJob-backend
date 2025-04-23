// Jobs Routes
// /api/jobs

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt'); 
const { getJobs, crearJob, actualizarJob, eliminarJob } = require('../controllers/jobs');   
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

// Todas las rutas requieren autenticación con JWT
router.use(validarJWT);

// Obtener todos los trabajos
router.get('/',  validarJWT , getJobs );

// Crear un nuevo trabajo
router.post('/', 
    [
      check('date', 'La fecha es obligatoria').not().isEmpty(), 
      check('title', 'El título es obligatorio').not().isEmpty(),
      check('company', 'El nombre de la empresa es obligatorio').not().isEmpty(),
      check('location', 'La ubicación es obligatoria').not().isEmpty(),
      check('status', 'El estado del trabajo es obligatorio').not().isEmpty(),
      validarCampos
    ],
    crearJob
);

// Actualizar un trabajo
router.put('/:id', actualizarJob);

// Eliminar un trabajo
router.delete('/:id', eliminarJob);

module.exports = router;
