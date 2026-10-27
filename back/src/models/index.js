const Usuario = require('./Usuario');
const Atleta = require('./Atleta');
const Time = require('./Time');
const Vaga = require('./Vaga');
const Evento = require('./Evento');
const InscricaoEvento = require('./InscricaoEvento');
const Candidatura = require('./Candidatura');
const Match = require('./Match');
const Conquista = require('./Conquista');
const FotoPerfil = require('./FotoPerfil');
const PreferenciaUsuario = require('./PreferenciaUsuario');

// Usuario → Atleta
Usuario.hasOne(Atleta, {
    foreignKey: 'usuario_id'
});

Usuario.hasMany(Conquista, { foreignKey: 'usuario_id' });
Conquista.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasMany(FotoPerfil, { foreignKey: 'usuario_id' });
FotoPerfil.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasOne(PreferenciaUsuario, { foreignKey: 'usuario_id' });
PreferenciaUsuario.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Atleta.belongsTo(Usuario, {
    foreignKey: 'usuario_id'
});

// Usuario → Time
Usuario.hasOne(Time, {
    foreignKey: 'usuario_id'
});

Time.belongsTo(Usuario, {
    foreignKey: 'usuario_id'
});

// Time → Vagas
Time.hasMany(Vaga, {
    foreignKey: 'time_id'
});

Vaga.belongsTo(Time, {
    foreignKey: 'time_id'
});

// Time → Eventos
Time.hasMany(Evento, {
    foreignKey: 'time_id'
});

Evento.belongsTo(Time, {
    foreignKey: 'time_id'
});

// Atleta → Candidaturas
Atleta.hasMany(Candidatura, {
    foreignKey: 'atleta_id'
});

Candidatura.belongsTo(Atleta, {
    foreignKey: 'atleta_id'
});

// Vaga → Candidaturas
Vaga.hasMany(Candidatura, {
    foreignKey: 'vaga_id'
});

Candidatura.belongsTo(Vaga, {
    foreignKey: 'vaga_id'
});

// Atleta → Inscrições
Atleta.hasMany(InscricaoEvento, {
    foreignKey: 'atleta_id'
});

InscricaoEvento.belongsTo(Atleta, {
    foreignKey: 'atleta_id'
});

// Evento → Inscrições
Evento.hasMany(InscricaoEvento, {
    foreignKey: 'evento_id'
});

InscricaoEvento.belongsTo(Evento, {
    foreignKey: 'evento_id'
});

// Atleta → Matches
Atleta.hasMany(Match, {
    foreignKey: 'atleta_id'
});

Match.belongsTo(Atleta, {
    foreignKey: 'atleta_id'
});

// Time → Matches
Time.hasMany(Match, {
    foreignKey: 'time_id'
});

Match.belongsTo(Time, {
    foreignKey: 'time_id'
});

module.exports = {
    Usuario,
    Atleta,
    Time,
    Vaga,
    Evento,
    InscricaoEvento,
    Candidatura,
    Match,
    Conquista,
    FotoPerfil,
    PreferenciaUsuario,
    sequelize: require('../config/database')
};