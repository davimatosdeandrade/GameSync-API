const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,
        define: {
            underscored: false,
            timestamps: true,
        }
    }
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection to MySQL was got successfully.')
    } catch (error) {
        console.log('Error trying to connect to the database.')
    }
}

testConnection();

module.exports = sequelize;