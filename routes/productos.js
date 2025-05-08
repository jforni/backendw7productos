const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validarCampos');
const {validarJWT} = require('../middlewares/validar-jwt');
const {esAdminRole} = require('../middlewares/validar-roles');
const { productoExiste } = require('../helpers/db-validators');
const { productosGet, productoGet, productoPost, productoPut, productoDelete } = require('../controllers/productos');


const router = Router();

router.get('/', productosGet);

router.get('/:id', 
    [
        check('id', 'El id no es válido').isMongoId(),
        check('id').custom(productoExiste),
        validarCampos,
    ],
    productoGet
);

router.post('/',
    [
        validarJWT,
        esAdminRole,
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        validarCampos
    ],
    productoPost
);

router.put('/:id', 
    [
        validarJWT,
        esAdminRole,
        check('id', 'El id no es válido').isMongoId(),
        check('id').custom(productoExiste),
        validarCampos,
    ],
    productoPut
);

router.delete('/:id',
    [
        validarJWT,
        esAdminRole,
        check('id', 'El id no es válido').isMongoId(),
        check('id').custom(productoExiste),
        validarCampos
    ],
    productoDelete
);

module.exports = router;