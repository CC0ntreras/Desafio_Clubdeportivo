var express = require('express');
var path = require('path');
var http = require('http');
var indexRouter = require('./routes/index');
const app = express();
const PORT = 3000;

app.use(express.static('assets'));

app.listen(PORT, () => {
    
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use('/', indexRouter);