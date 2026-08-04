const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Media = db.define('Media', {
    id_media: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_product: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tp_type: {
        type: DataTypes.ENUM('image', 'video'),
        allowNull: false,
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    order_index: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }
}, {
    tableName: 'tb_medias',
    timestamps: true,
    createdAt: 'dt_createdAt',
    updatedAt: 'dt_updatedAt',
});

module.exports = Media;