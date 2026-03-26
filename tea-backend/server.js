const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const paymentRoutes   = require('./Routes/paymentRoutes');
const teaRoutes      = require('./Routes/teaRoutes');
const employeeRoutes = require('./Routes/employeeRoutes');
app.use('/api/employees', employeeRoutes);
app.use('/api/tea',       teaRoutes);   
app.use('/api/payments',       paymentRoutes);  
app.get('/', (req, res) => {
  res.json({ message: 'Server is running ✅' });
});

const MONGO_URI = "mongodb://harsha:harsha123@ac-eiyswry-shard-00-00.qjjt7pa.mongodb.net:27017,ac-eiyswry-shard-00-01.qjjt7pa.mongodb.net:27017,ac-eiyswry-shard-00-02.qjjt7pa.mongodb.net:27017/offtea?ssl=true&replicaSet=atlas-xrufcf-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(5000, '0.0.0.0', () => {
      console.log('🚀 Server running on 5000');
    });
  })
  .catch(err => {
    console.log('❌ MongoDB Error:', err.message);
  });