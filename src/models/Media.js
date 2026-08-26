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
        type: DataTypes.ENUM('cover', 'banner', 'screenshot', 'icon', 'trailer', 'gameplay'),
        allowNull: false,
    },
    tp_aspect: {
        type: DataTypes.ENUM('16:9', '9:16', '21:5', '3:4', 'free'),
        allowNull: false,
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'tb_medias',
    timestamps: true,
    paranoid: true,
    createdAt: 'dt_createdAt',
    updatedAt: 'dt_updatedAt',
    deletedAt: 'dt_deletedAt',
});

module.exports = Media;