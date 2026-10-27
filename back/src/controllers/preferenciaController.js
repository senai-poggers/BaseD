const { PreferenciaUsuario } = require('../models');

const defaults = Object.freeze({
    eventNotifications: true,
    matchNotifications: true,
    activityNotifications: true,
    publicProfile: true,
    showLocation: true
});
const keys = Object.keys(defaults);

function validPreferences(value) {
    return value && typeof value === 'object' && !Array.isArray(value) &&
        keys.every(key => typeof value[key] === 'boolean') &&
        Object.keys(value).every(key => keys.includes(key));
}

async function obter(req, res, next) {
    try {
        const [record] = await PreferenciaUsuario.findOrCreate({
            where: { usuario_id: req.user.id },
            defaults: { usuario_id: req.user.id, preferencias: defaults }
        });
        return res.json(record.preferencias);
    } catch (error) {
        return next(error);
    }
}

async function atualizar(req, res, next) {
    if (!validPreferences(req.body)) {
        return res.status(400).json({ mensagem: 'As preferências informadas são inválidas.' });
    }
    try {
        const [record] = await PreferenciaUsuario.findOrCreate({
            where: { usuario_id: req.user.id },
            defaults: { usuario_id: req.user.id, preferencias: req.body }
        });
        await record.update({ preferencias: req.body });
        return res.json(record.preferencias);
    } catch (error) {
        return next(error);
    }
}

async function restaurar(req, res, next) {
    try {
        const [record] = await PreferenciaUsuario.findOrCreate({
            where: { usuario_id: req.user.id },
            defaults: { usuario_id: req.user.id, preferencias: defaults }
        });
        await record.update({ preferencias: defaults });
        return res.json(record.preferencias);
    } catch (error) {
        return next(error);
    }
}

module.exports = { obter, atualizar, restaurar };
