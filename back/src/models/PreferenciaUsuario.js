const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PreferenciaUsuario = sequelize.define('PreferenciaUsuario', {
    usuario_id: { type: DataTypes.INTEGER, primaryKey: true },
    preferencias: { type: DataTypes.JSONB, allowNull: false }
}, { tableName: 'preferencias_usuarios', timestamps: false });

module.exports = PreferenciaUsuario;
