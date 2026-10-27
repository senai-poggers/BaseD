const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Atleta = sequelize.define(
    'Atleta',
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

        posicao: {
            type: DataTypes.STRING(100)
        },

        nivel: {
            type: DataTypes.STRING(50)
        },

        experiencia: {
            type: DataTypes.TEXT
        },

        habilidades: {
            type: DataTypes.TEXT
        },

        descricao: {
            type: DataTypes.TEXT
        },

        foto_url: {
            type: DataTypes.TEXT
        },

        disponibilidade: {
            type: DataTypes.STRING(100)
        }
    },
    {
        tableName: 'atletas',
        timestamps: false
    }
);

module.exports = Atleta;