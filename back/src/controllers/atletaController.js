const { Atleta } = require('../models');

async function listarAtletas(req, res) {
    try {
        const atletas = await Atleta.findAll({ where: { usuario_id: req.user.id } });

        return res.status(200).json(atletas);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao buscar atletas.',
            erro: erro.message
        });
    }
}

async function buscarAtleta(req, res) {
    try {
        const atleta = await Atleta.findOne({ where: { id: req.params.id, usuario_id: req.user.id } });

        if (!atleta) {
            return res.status(404).json({
                mensagem: 'Atleta não encontrado.'
            });
        }

        return res.status(200).json(atleta);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao buscar atleta.',
            erro: erro.message
        });
    }
}

async function criarAtleta(req, res) {
    return res.status(409).json({ mensagem: 'O perfil de atleta é criado junto com a conta.' });
}

async function atualizarAtleta(req, res) {
    try {
        const atleta = await Atleta.findOne({ where: { id: req.params.id, usuario_id: req.user.id } });

        if (!atleta) {
            return res.status(404).json({
                mensagem: 'Atleta não encontrado.'
            });
        }

        const allowed = ['esporte', 'posicao', 'nivel', 'experiencia', 'habilidades', 'descricao', 'foto_url', 'disponibilidade'];
        const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
        await atleta.update(updates);

        return res.status(200).json(atleta);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao atualizar atleta.',
            erro: erro.message
        });
    }
}

async function excluirAtleta(req, res) {
    try {
        const atleta = await Atleta.findOne({ where: { id: req.params.id, usuario_id: req.user.id } });

        if (!atleta) {
            return res.status(404).json({
                mensagem: 'Atleta não encontrado.'
            });
        }

        await atleta.destroy();

        return res.status(200).json({
            mensagem: 'Atleta excluído com sucesso.'
        });
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao excluir atleta.',
            erro: erro.message
        });
    }
}

module.exports = {
    listarAtletas,
    buscarAtleta,
    criarAtleta,
    atualizarAtleta,
    excluirAtleta
};