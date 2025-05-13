const { response, request } = require('express');

//Importar los modelos
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

//Definir las colecciones permitidas 
const coleccionesPermitidas = ['usuarios', 'categorias', 'productos'];

//Buscar usuarios
const buscarUsuarios = async (termino, res = response) => {
    const regex = new RegExp(termino, "i");

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }],
    });

    res.json({
        msg: 'Usuarios encontrados',
        results: usuarios
    })
}

//Buscar Categorias
const buscarCategorias = async (termino, res = response) => {
    const regex = new RegExp(termino, "i");

    const categorias = await Categoria.find({
        nombre: regex,
        estado: true
    });

    res.json({
        msg: 'Categorías encontradas:',
        results: categorias,
    })
}

//Buscar Productos
const buscarProductos = async (termino, res = response) => {
    const regex = new RegExp(termino, "i");

    const productos = await Producto.find({
        $or: [{ nombre: regex }, { descripcion: regex }],
        $and: [{ estado: true }],
    });

    res.json({
        msg: 'Productos encontrados',
        results: productos,
    })
}

//Función principal para las búsquedas
const buscar = (req = request, res = response) => {
    const { coleccion, termino } = req.params;

    //Validar la colección
    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
        });
    }

    //En función de la colección, buscar por el termino
    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Hubo un error al hacer la búsqueda',
            });
            break;
    }
}

module.exports = {
    buscar
}