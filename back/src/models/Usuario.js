const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define(
    'Usuario',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nome: {
            type: DataTypes.STRING(100)
        },

        email: {
            type: DataTypes.STRING(150),
            unique: true
        },

        senha: {
            type: DataTypes.STRING(255)
        },

        tipo_perfil: {
            type: DataTypes.STRING(20)
        },

        cidade: {
            type: DataTypes.STRING(100)
        }
    },
    {
        tableName: 'usuarios',
        timestamps: false
    }
);

module.exports = Usuario;