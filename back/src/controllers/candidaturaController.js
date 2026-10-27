const { Atleta, Candidatura, Vaga } = require('../models');

async function listarCandidaturas(req, res) {
    try {
        const candidaturas = await Candidatura.findAll();

        return res.status(200).json(candidaturas);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao buscar candidaturas.',
            erro: erro.message
        });
    }
}

async function buscarCandidatura(req, res) {
    try {
        const candidatura = await Candidatura.findByPk(req.params.id);

        if (!candidatura) {
            return res.status(404).json({
                mensagem: 'Candidatura não encontrada.'
            });
        }

        return res.status(200).json(candidatura);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao buscar candidatura.',
            erro: erro.message
        });
    }
}

async function criarCandidatura(req, res) {
    try {
        const atleta = await Atleta.findOne({ where: { usuario_id: req.user.id } });
        if (!atleta) return res.status(403).json({ mensagem: 'Apenas atletas podem enviar candidaturas.' });
        const { vaga_id } = req.body;
        if (!Number.isInteger(Number(vaga_id))) return res.status(400).json({ mensagem: 'Vaga inválida.' });
        const vaga = await Vaga.findOne({ where: { id: vaga_id, status: 'aberta' } });
        if (!vaga) return res.status(404).json({ mensagem: 'Vaga aberta não encontrada.' });
        const existing = await Candidatura.findOne({ where: { atleta_id: atleta.id, vaga_id } });
        if (existing) return res.status(409).json({ mensagem: 'Você já se candidatou a esta vaga.' });

        const candidatura = await Candidatura.create({
            atleta_id: atleta.id,
            vaga_id: Number(vaga_id)
        });

        return res.status(201).json(candidatura);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao criar candidatura.',
            erro: erro.message
        });
    }
}

async function atualizarCandidatura(req, res) {
    try {
        const candidatura = await Candidatura.findByPk(req.params.id);

        if (!candidatura) {
            return res.status(404).json({
                mensagem: 'Candidatura não encontrada.'
            });
        }

        await candidatura.update(req.body);

        return res.status(200).json(candidatura);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao atualizar candidatura.',
            erro: erro.message
        });
    }
}

async function excluirCandidatura(req, res) {
    try {
        const candidatura = await Candidatura.findByPk(req.params.id);

        if (!candidatura) {
            return res.status(404).json({
                mensagem: 'Candidatura não encontrada.'
            });
        }

        await candidatura.destroy();

        return res.status(200).json({
            mensagem: 'Candidatura excluída com sucesso.'
        });
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao excluir candidatura.',
            erro: erro.message
        });
    }
}

module.exports = {
    listarCandidaturas,
    buscarCandidatura,
    criarCandidatura,
    atualizarCandidatura,
    excluirCandidatura
};