const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FotoPerfil = sequelize.define('FotoPerfil', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    imagem: { type: DataTypes.TEXT, allowNull: false },
    titulo: { type: DataTypes.STRING(60), allowNull: false },
    descricao: { type: DataTypes.STRING(240), allowNull: false, defaultValue: '' },
    curtidas: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    curtida_pelo_usuario: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    fixada: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, { tableName: 'fotos_perfil', timestamps: false });

module.exports = FotoPerfil;
