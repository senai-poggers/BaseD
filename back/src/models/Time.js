const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Time = sequelize.define(
    'Time',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },

        esporte: {
            type: DataTypes.STRING(100)
        },

        nome: {
            type: DataTypes.STRING(100)
        },

        cidade: {
            type: DataTypes.STRING(100)
        },

        descricao: {
            type: DataTypes.TEXT
        },

        logo_url: {
            type: DataTypes.TEXT
        },

        contato: {
            type: DataTypes.STRING(100)
        }
    },
    {
        tableName: 'times',
        timestamps: false
    }
);

module.exports = Time;