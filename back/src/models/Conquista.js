const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conquista = sequelize.define('Conquista', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    titulo: { type: DataTypes.STRING(80), allowNull: false },
    tipo: { type: DataTypes.STRING(20), allowNull: false },
    local: { type: DataTypes.STRING(60), allowNull: false, defaultValue: '' },
    ano: { type: DataTypes.STRING(4), allowNull: false, defaultValue: '' }
}, { tableName: 'conquistas', timestamps: false });

module.exports = Conquista;
