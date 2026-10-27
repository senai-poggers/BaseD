const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Candidatura = sequelize.define(
    'Candidatura',
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

        vaga_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        status: {
            type: DataTypes.STRING(30),
            defaultValue: 'pendente'
        },

        data_candidatura: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'candidaturas',
        timestamps: false
    }
);

module.exports = Candidatura;