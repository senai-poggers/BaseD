const { Time } = require('../models');

async function listarTimes(req, res) {
    try {
        const times = await Time.findAll({ order: [['nome', 'ASC']] });

        return res.status(200).json(times.map(formatTime));
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao buscar times.',
            erro: erro.message
        });
    }
}

async function buscarTime(req, res) {
    try {
        const time = await Time.findByPk(req.params.id);

        if (!time) {
            return res.status(404).json({
                mensagem: 'Time não encontrado.'
            });
        }

        return res.status(200).json(formatTime(time));
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao buscar time.',
            erro: erro.message
        });
    }
}

async function criarTime(req, res) {
    try {
        const body = req.body && typeof req.body === 'object' ? req.body : {};
        const { esporte, nome, cidade, descricao, logo_url, contato } = body;
        if (typeof nome !== 'string' || !nome.trim() || nome.length > 100) {
            return res.status(400).json({ mensagem: 'Informe um nome válido para o time.' });
        }

        if (
            (esporte !== undefined && (typeof esporte !== 'string' || esporte.length > 100)) ||
            (cidade !== undefined && (typeof cidade !== 'string' || cidade.length > 100)) ||
            (descricao !== undefined && (typeof descricao !== 'string' || descricao.length > 5000)) ||
            (logo_url !== undefined && (typeof logo_url !== 'string' || logo_url.length > 2000)) ||
            (contato !== undefined && (typeof contato !== 'string' || contato.length > 100))
        ) {
            return res.status(400).json({ mensagem: 'Os dados do time são inválidos.' });
        }

        const [time, created] = await Time.findOrCreate({
            where: { usuario_id: req.user.id },
            defaults: { usuario_id: req.user.id, esporte, nome: nome.trim(), cidade, descricao, logo_url, contato }
        });
        if (!created) await time.update({ esporte, nome: nome.trim(), cidade, descricao, logo_url, contato });

        return res.status(created ? 201 : 200).json(formatTime(time));
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao criar time.',
            erro: erro.message
        });
    }
}

async function atualizarTime(req, res) {
    try {
        const time = await Time.findOne({ where: { id: req.params.id, usuario_id: req.user.id } });

        if (!time) {
            return res.status(404).json({ mensagem: 'Time não encontrado.' });
        }

        const body = req.body && typeof req.body === 'object' ? req.body : {};
        const { esporte, nome, cidade, descricao, logo_url, contato } = body;
        if (typeof nome !== 'string' || !nome.trim() || nome.length > 100) {
            return res.status(400).json({ mensagem: 'Informe um nome válido para o time.' });
        }
        await time.update({
            ...(typeof esporte === 'string' && esporte.length <= 100 ? { esporte } : {}),
            nome: nome.trim(),
            ...(typeof cidade === 'string' && cidade.length <= 100 ? { cidade } : {}),
            ...(typeof descricao === 'string' && descricao.length <= 5000 ? { descricao } : {}),
            ...(typeof logo_url === 'string' && logo_url.length <= 2000 ? { logo_url } : {}),
            ...(typeof contato === 'string' && contato.length <= 100 ? { contato } : {})
        });

        return res.status(200).json(formatTime(time));
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao atualizar time.',
            erro: erro.message
        });
    }
}

async function excluirTime(req, res) {
    try {
        const time = await Time.findOne({ where: { id: req.params.id, usuario_id: req.user.id } });

        if (!time) {
            return res.status(404).json({
                mensagem: 'Time não encontrado.'
            });
        }

        await time.destroy();

        return res.status(200).json({
            mensagem: 'Time excluído com sucesso.'
        });
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao excluir time.',
            erro: erro.message
        });
    }
}

function formatTime(time) {
    return {
        id: String(time.id),
        name: time.nome || '',
        info: time.esporte || '',
        city: time.cidade || '',
        dist: time.cidade || ''
    };
}

module.exports = {
    listarTimes,
    buscarTime,
    criarTime,
    atualizarTime,
    excluirTime
};