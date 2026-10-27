const crypto = require('crypto');
const { promisify } = require('util');
const { sequelize, Usuario, Atleta, Time } = require('../models');
const { assertSecretConfigured, createToken } = require('../middleware/auth');

const scrypt = promisify(crypto.scrypt);

function validPassword(password) {
    const length = Array.from(password).length;
    return length >= 8 && length <= 128;
}

function publicUser(user) {
    return {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo_perfil: user.tipo_perfil,
        cidade: user.cidade
    };
}

async function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const derived = await scrypt(password, salt, 64);
    return `scrypt$${salt}$${derived.toString('hex')}`;
}

async function verifyPassword(password, stored) {
    if (typeof stored !== 'string') return false;
    const [algorithm, salt, hash] = stored.split('$');
    if (algorithm !== 'scrypt' || !salt || !hash) return false;
    const expected = Buffer.from(hash, 'hex');
    const actual = await scrypt(password, salt, expected.length);
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

async function cadastrar(req, res, next) {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const { nome, email, senha, tipo_perfil, cidade } = body;
    if (
        typeof nome !== 'string' || !nome.trim() || nome.length > 100 ||
        typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 150 ||
        typeof senha !== 'string' || !validPassword(senha) ||
        !['atleta', 'time', 'organizador'].includes(tipo_perfil) ||
        typeof cidade !== 'string' || cidade.length > 100
    ) {
        return res.status(400).json({
            mensagem: 'Informe nome, e-mail válido, senha de 8 a 128 caracteres, perfil e cidade.'
        });
    }

    try {
        assertSecretConfigured();
        const user = await sequelize.transaction(async (transaction) => {
            const created = await Usuario.create({
                nome: nome.trim(),
                email: email.trim().toLowerCase(),
                senha: await hashPassword(senha),
                tipo_perfil,
                cidade: cidade.trim()
            }, { transaction });

            if (tipo_perfil === 'atleta') {
                await Atleta.create({ usuario_id: created.id }, { transaction });
            } else if (tipo_perfil === 'time') {
                await Time.create({ usuario_id: created.id, cidade: cidade.trim() }, { transaction });
            }
            return created;
        });
        return res.status(201).json({ usuario: publicUser(user), token: createToken(user.id) });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ mensagem: 'Este e-mail já está cadastrado.' });
        }
        return next(error);
    }
}

async function entrar(req, res, next) {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const { email, senha } = body;
    if (typeof email !== 'string' || typeof senha !== 'string') {
        return res.status(400).json({ mensagem: 'Informe e-mail e senha.' });
    }

    try {
        assertSecretConfigured();
        const user = await Usuario.findOne({ where: { email: email.trim().toLowerCase() } });
        const valid = user && await verifyPassword(senha, user.senha);
        if (!valid) return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
        return res.status(200).json({ usuario: publicUser(user), token: createToken(user.id) });
    } catch (error) {
        return next(error);
    }
}

module.exports = { cadastrar, entrar };
