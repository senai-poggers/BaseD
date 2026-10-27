const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Match = sequelize.define(
    'Match',
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

        time_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        porcentagem: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        explicacao: {
            type: DataTypes.TEXT
        },

        status: {
            type: DataTypes.STRING(30),
            defaultValue: 'pendente'
        },

        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'matches',
        timestamps: false
    }
);

module.exports = Match;