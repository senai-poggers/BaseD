const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InscricaoEvento = sequelize.define(
    'InscricaoEvento',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        atleta_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        evento_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        status: {
            type: DataTypes.STRING(30),
            defaultValue: 'inscrito'
        },

        data_inscricao: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'inscricoes_eventos',
        timestamps: false
    }
);

module.exports = InscricaoEvento;