const { Schema , model } = require('mongoose');


const UsuarioSchema = Schema({
     name: {
         type: String,
         required: true
     },
     email: { 
           type: String,
           required: true,
           unique: true
     },
        password: {
            type: String,
            required: true,
        },
         description: {
        type: String,
        default: ''
    },
    profileImage: {
        type: String,
        default: ''
    }
});


module.exports = model('Usuario', UsuarioSchema);