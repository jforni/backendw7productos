const { response, request } = require('express');
const Producto = require('../models/producto');

//Get para traer todos los productos
const productosGet = async (req=request, res=response) => {
    const {desde = 0, limite = 5} = req.query;
    const query = {estado: true};

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
     /*        .populate('usuario','correo') */
            .populate('categoria', 'nombre'),
    ]);

    res.json({
        msg: 'Productos obtenidos',
        total,
        productos,
    })
};

//Get para traer un producto por ID
const productoGet = async (req=request, res=response) => {
    const {id} = req.params;

    const producto = await Producto.findById(id)
        /* .populate('usuario', 'correo') */
        .populate('categoria', 'nombre');

    res.json({
        msg: 'Producto obtenido según lo pedido',
        producto
    })
};

//Crear un producto
const productoPost = async (req=request, res=response) => {
    const {precio, categoria, descripcion, img, stock} = req.body;
    const nombre = req.body.nombre.toUpperCase();

    const productoDB= await Producto.findOne({nombre});

    //validar si el producto existe
    if(productoDB){
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`,
        })
    }

    //Generar la data a guardar en DB del producto
    const data = { nombre, categoria, precio, descripcion, img, stock,  usuario:req.usuario._id}

    const producto = new Producto(data)

    //Grabar en BD
    await producto.save();

    res.status(201).json({
        msg: 'Producto creado con éxito!',
        producto,
    });
}

//Modificar un producto
const productoPut = async (req, res) => {
    const {id} = req.params;
    const {precio, categoria, descripcion, destacado, img, stock} = req.body;

    const usuario = req.usuario_id;
    
    let data ={
        precio, descripcion, categoria, destacado, img, stock, usuario
    };

    //Si viene el nombre del producto
    if(req.body.nombre){
        data.nombre = req.body.nombre.toUpperCase();
    }

    const producto = await Producto.findByIdAndUpdate(id, data, {new:true});

    res.status(201).json({
        msg: 'El producto se actualizó',
        producto
    });
}

//Inhabilitar un producto
const productoDelete = async (req, res) => {
    const {id} = req.params;

    const productoInactivo = await Producto.findByIdAndUpdate(id, {estado: false}, {new:true});

    res.json({
        msg: `El producto ${productoInactivo.nombre} se inactivó`,
        productoInactivo
    });
};

module.exports = {
    productosGet,
    productoGet,
    productoPost,
    productoPut,
    productoDelete
};