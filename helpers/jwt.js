const jwt = require('jsonwebtoken');


const generarJWT = ( id, name ) => {
      
    const payload = { id, name };

    return new Promise( (resolve, reject) => {
        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
        }, (err, token) => {
            if ( err ) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve( token );
            }
        });
    });

}


module.exports = {
   generarJWT,
}