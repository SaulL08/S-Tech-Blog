// path: src/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const routes = require('./routes');
const errorHandler = require('./middlewares/error');

const app = express();

connectDB();

// CORS configurado según entorno
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos desde uploads
app.use('/uploads', express.static('uploads'));

app.use('/api', routes);

app.use(errorHandler);

module.exports = app;