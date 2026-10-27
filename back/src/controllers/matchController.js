const { Match } = require('../models');

async function listarMatches(req, res) {
    try {
        const matches = await Match.findAll();

        return res.status(200).json(matches);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao buscar matches.',
            erro: erro.message
        });
    }
}

async function buscarMatch(req, res) {
    try {
        const match = await Match.findByPk(req.params.id);

        if (!match) {
            return res.status(404).json({
                mensagem: 'Match não encontrado.'
            });
        }

        return res.status(200).json(match);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao buscar match.',
            erro: erro.message
        });
    }
}

async function criarMatch(req, res) {
    try {
        const {
            atleta_id,
            time_id,
            porcentagem,
            explicacao,
            status
        } = req.body;

        const match = await Match.create({
            atleta_id,
            time_id,
            porcentagem,
            explicacao,
            status
        });

        return res.status(201).json(match);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao criar match.',
            erro: erro.message
        });
    }
}

async function atualizarMatch(req, res) {
    try {
        const match = await Match.findByPk(req.params.id);

        if (!match) {
            return res.status(404).json({
                mensagem: 'Match não encontrado.'
            });
        }

        await match.update(req.body);

        return res.status(200).json(match);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao atualizar match.',
            erro: erro.message
        });
    }
}

async function excluirMatch(req, res) {
    try {
        const match = await Match.findByPk(req.params.id);

        if (!match) {
            return res.status(404).json({
                mensagem: 'Match não encontrado.'
            });
        }

        await match.destroy();

        return res.status(200).json({
            mensagem: 'Match excluído com sucesso.'
        });
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao excluir match.',
            erro: erro.message
        });
    }
}

module.exports = {
    listarMatches,
    buscarMatch,
    criarMatch,
    atualizarMatch,
    excluirMatch
};