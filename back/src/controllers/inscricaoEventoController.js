const { Atleta, Evento, InscricaoEvento } = require('../models');

async function listarInscricoes(req, res) {
    try {
        const inscricoes = await InscricaoEvento.findAll();

        return res.status(200).json(inscricoes);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao buscar inscrições.',
            erro: erro.message
        });
    }
}

async function buscarInscricao(req, res) {
    try {
        const inscricao = await InscricaoEvento.findByPk(req.params.id);

        if (!inscricao) {
            return res.status(404).json({
                mensagem: 'Inscrição não encontrada.'
            });
        }

        return res.status(200).json(inscricao);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao buscar inscrição.',
            erro: erro.message
        });
    }
}

async function criarInscricao(req, res) {
    try {
        const atleta = await Atleta.findOne({ where: { usuario_id: req.user.id } });
        if (!atleta) return res.status(403).json({ mensagem: 'Apenas atletas podem se inscrever em eventos.' });
        const { evento_id } = req.body;
        if (!Number.isInteger(Number(evento_id))) return res.status(400).json({ mensagem: 'Evento inválido.' });
        const evento = await Evento.findOne({ where: { id: evento_id, status: 'aberto' } });
        if (!evento) return res.status(404).json({ mensagem: 'Evento aberto não encontrado.' });
        const existing = await InscricaoEvento.findOne({ where: { atleta_id: atleta.id, evento_id } });
        if (existing) return res.status(409).json({ mensagem: 'Você já está inscrito neste evento.' });

        const inscricao = await InscricaoEvento.create({
            atleta_id: atleta.id,
            evento_id: Number(evento_id)
        });

        return res.status(201).json(inscricao);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao criar inscrição.',
            erro: erro.message
        });
    }
}

async function atualizarInscricao(req, res) {
    try {
        const inscricao = await InscricaoEvento.findByPk(req.params.id);

        if (!inscricao) {
            return res.status(404).json({
                mensagem: 'Inscrição não encontrada.'
            });
        }

        await inscricao.update(req.body);

        return res.status(200).json(inscricao);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao atualizar inscrição.',
            erro: erro.message
        });
    }
}

async function excluirInscricao(req, res) {
    try {
        const inscricao = await InscricaoEvento.findByPk(req.params.id);

        if (!inscricao) {
            return res.status(404).json({
                mensagem: 'Inscrição não encontrada.'
            });
        }

        await inscricao.destroy();

        return res.status(200).json({
            mensagem: 'Inscrição excluída com sucesso.'
        });
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao excluir inscrição.',
            erro: erro.message
        });
    }
}

module.exports = {
    listarInscricoes,
    buscarInscricao,
    criarInscricao,
    atualizarInscricao,
    excluirInscricao
};