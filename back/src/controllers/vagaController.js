const { Vaga, Time } = require('../models');

async function listarVagas(req, res) {
    try {
        const { Candidatura } = require('../models');
        const vagas = await Vaga.findAll({
            where: { status: 'aberta' },
            include: [
                { model: Time, attributes: ['nome', 'esporte', 'cidade'] },
                { model: Candidatura, attributes: ['id'], required: false }
            ],
            order: [['id', 'DESC']]
        });

        return res.status(200).json(vagas.map(formatOpening));
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao buscar vagas.',
            erro: erro.message
        });
    }
}

async function buscarVaga(req, res) {
    try {
        const { Candidatura } = require('../models');
        const vaga = await Vaga.findOne({
            where: { id: req.params.id, status: 'aberta' },
            include: [
                { model: Time, attributes: ['nome', 'esporte', 'cidade'] },
                { model: Candidatura, attributes: ['id'], required: false }
            ]
        });

        if (!vaga) {
            return res.status(404).json({
                mensagem: 'Vaga não encontrada.'
            });
        }

        return res.status(200).json(formatOpening(vaga));
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao buscar vaga.',
            erro: erro.message
        });
    }
}

async function criarVaga(req, res) {
    try {
        const body = req.body && typeof req.body === 'object' ? req.body : {};
        const {
            time_id,
            titulo,
            esporte,
            posicao,
            descricao,
            nivel,
            cidade,
            data_limite,
            open_positions = 1
        } = body;
        if (
            !Number.isInteger(Number(time_id)) ||
            typeof titulo !== 'string' || !titulo.trim() || titulo.length > 100 ||
            typeof esporte !== 'string' || !esporte.trim() || esporte.length > 100 ||
            !Number.isInteger(Number(open_positions)) || Number(open_positions) < 1
        ) {
            return res.status(400).json({ mensagem: 'Os dados da vaga são inválidos.' });
        }
        const time = await Time.findOne({ where: { id: time_id, usuario_id: req.user.id } });
        if (!time) return res.status(403).json({ mensagem: 'Você não pode criar vagas para este time.' });

        const vaga = await Vaga.create({
            time_id: time.id,
            titulo: titulo.trim(),
            esporte,
            posicao,
            descricao,
            nivel,
            cidade: cidade || time.cidade,
            status: 'aberta',
            data_limite,
            open_positions: Number(open_positions)
        });

        return res.status(201).json(vaga);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao criar vaga.',
            erro: erro.message
        });
    }
}

async function atualizarVaga(req, res) {
    try {
        const vaga = await Vaga.findByPk(req.params.id, { include: [{ model: Time, attributes: ['usuario_id'] }] });

        if (!vaga) return res.status(404).json({ mensagem: 'Vaga não encontrada.' });
        if (vaga.Time?.usuario_id !== req.user.id) return res.status(403).json({ mensagem: 'Você não pode editar esta vaga.' });

        const allowed = ['titulo', 'esporte', 'posicao', 'descricao', 'nivel', 'cidade', 'status', 'data_limite', 'open_positions'];
        const body = req.body && typeof req.body === 'object' ? req.body : {};
        const updates = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)));
        await vaga.update(updates);

        return res.status(200).json(vaga);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao atualizar vaga.',
            erro: erro.message
        });
    }
}

async function excluirVaga(req, res) {
    try {
        const vaga = await Vaga.findByPk(req.params.id, { include: [{ model: Time, attributes: ['usuario_id'] }] });

        if (!vaga) return res.status(404).json({ mensagem: 'Vaga não encontrada.' });
        if (vaga.Time?.usuario_id !== req.user.id) return res.status(403).json({ mensagem: 'Você não pode excluir esta vaga.' });

        await vaga.destroy();

        return res.status(200).json({
            mensagem: 'Vaga excluída com sucesso.'
        });
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao excluir vaga.',
            erro: erro.message
        });
    }
}

function formatOpening(vaga) {
    return {
        id: String(vaga.id),
        pos: vaga.posicao || vaga.titulo,
        tags: [vaga.esporte, vaga.nivel, vaga.cidade].filter(Boolean),
        qtd: vaga.open_positions,
        data: vaga.data_limite ? new Date(`${vaga.data_limite}T00:00:00`).toLocaleDateString('pt-BR') : '',
        candidatos: vaga.Candidaturas?.length || 0,
        time: vaga.Time?.nome || ''
    };
}

module.exports = {
    listarVagas,
    buscarVaga,
    criarVaga,
    atualizarVaga,
    excluirVaga
};