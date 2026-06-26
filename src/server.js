const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/database');
const app = express();

app.use(express.json());
app.use(cors());

const productRoutes = require('./routes/productRoutes');

app.use(productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});