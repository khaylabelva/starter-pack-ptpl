const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const serverless = require('serverless-http');

dotenv.config();

const authRoutes = require('../routes/auth');
const productRoutes = require('../routes/products');
const taskRoutes = require('../routes/tasks');

const app = express();

app.use(cors({ origin: 'http://localhost:8081' }));
app.use(express.json());

app.use('/login', authRoutes);
app.use('/products', productRoutes);
app.use('/tasks', taskRoutes);

module.exports.handler = serverless(app);