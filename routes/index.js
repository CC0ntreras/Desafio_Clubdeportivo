var express = require('express');
var router = express.Router();
const fs = require('fs');
const dataPath = 'public/data/data.json'

/* GET home page. */
router.get('/agregar', (req, res) => {
  console.log(req.query)
  try {
    const { nombre, precio } = req.query; // Obtiene datos desde queryStrings
    if (!nombre.trim() || !precio) { throw new Error("Nombre o precio faltante"); }
    if (typeof nombre !== 'string') {
      throw new Error("El nombre debe ser una cadena de texto.");
    }
    if (isNaN(precio)) {
      throw new Error("El precio debe ser un número.");
    }
    let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    if (data.deportes.find(d => d.nombre === nombre.trim())) { throw new Error("El deporte ya existe"); }

    data.deportes.push({ nombre, precio });
    fs.writeFileSync(dataPath, JSON.stringify(data));
    res.status(201).send("Deporte agregado");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Ruta para obtener todos los deportes
router.get('/deportes', (req, res) => {
  let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  res.json(data);
});

// Ruta para editar un deporte
router.get('/editar', (req, res) => {
  console.log(req.query)
  try {
    const { nombre, precio } = req.query;
    if (!nombre.trim() || !precio) { throw new Error("Nombre o nuevo precio faltante"); }
    if (typeof nombre !== 'string') {
      throw new Error("El nombre debe ser una cadena de texto.");
    }
    if (isNaN(precio)) {
      throw new Error("El precio debe ser un número.");
    }
    let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    let index = data.deportes.findIndex(d => d.nombre === nombre.trim());
    if (index === -1) { throw new Error("Deporte no encontrado"); }

    data.deportes[index].precio = precio;

    fs.writeFileSync(dataPath, JSON.stringify(data));
    res.send("Precio actualizado");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Ruta para eliminar un deporte
router.post('/eliminar', (req, res) => {

  try {
    const { nombre } = req.body;
    console.log(nombre)
    if (!nombre || !nombre.trim()) { throw new Error("No es posible eliminar el Deporte ya que no tiene nombre"); }
    let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    let newData = data.deportes.filter(d => d.nombre !== nombre.trim());

    if (newData.length === data.deportes.length) { throw new Error("Deporte no encontrado"); }
    let result = { deportes: newData }; // Mantenemos la estructura de objeto con la propiedad 'deportes'
    fs.writeFileSync(dataPath, JSON.stringify(result));


    res.send("Deporte eliminado");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Ruta no encontrada
router.use((req, res) => {
  res.status(404).send("Ruta no encontrada");
});

module.exports = router;
