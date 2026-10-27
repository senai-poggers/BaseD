const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Evento = sequelize.define(
    'Evento',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        time_id: {
            type: DataTypes.INTEGER
        },

        titulo: {
            type: DataTypes.STRING(100)
        },

        tipo: {
            type: DataTypes.STRING(50)
        },

        descricao: {
            type: DataTypes.TEXT
        },

        data: {
            type: DataTypes.DATEONLY
        },

        cidade: {
            type: DataTypes.STRING(100)
        },

        status: {
            type: DataTypes.STRING(30),
            defaultValue: 'aberto'
        },

        vagas_abertas: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        tableName: 'eventos',
        timestamps: false
    }
);

module.exports = Evento;