const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vaga = sequelize.define(
    'Vaga',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        time_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        titulo: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        esporte: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        posicao: {
            type: DataTypes.STRING(100)
        },

        descricao: {
            type: DataTypes.TEXT
        },

        nivel: {
            type: DataTypes.STRING(50)
        },

        cidade: {
            type: DataTypes.STRING(100)
        },

        status: {
            type: DataTypes.STRING(30),
            defaultValue: 'aberta'
        },

        data_limite: {
            type: DataTypes.DATEONLY
        },

        open_positions: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    },
    {
        tableName: 'vagas',
        timestamps: false
    }
);

module.exports = Vaga;