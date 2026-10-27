const { Evento, Time } = require('../models');

async function listarEventos(req, res) {
    try {
        const { Op } = require('sequelize');
        const where = { status: 'aberto' };
        if (['evento', 'campeonato'].includes(req.query.tipo)) where.tipo = req.query.tipo;
        if (typeof req.query.busca === 'string' && req.query.busca.trim()) {
            const busca = `%${req.query.busca.trim()}%`;
            where[Op.or] = [
                { titulo: { [Op.iLike]: busca } },
                { descricao: { [Op.iLike]: busca } },
                { cidade: { [Op.iLike]: busca } }
            ];
        }
        const eventos = await Evento.findAll({ where, order: [['data', 'ASC']] });

        return res.status(200).json(eventos.map(evento => ({
            id: String(evento.id),
            nome: evento.titulo || '',
            tipo: evento.tipo || 'evento',
            info: evento.descricao || '',
            datas: evento.data ? new Date(`${evento.data}T00:00:00`).toLocaleDateString('pt-BR') : '',
            local: evento.cidade || '',
            vagas: Number(evento.vagas_abertas || 0)
        })));
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao buscar eventos.',
            erro: erro.message
        });
    }
}

async function buscarEvento(req, res) {
    try {
        const evento = await Evento.findOne({ where: { id: req.params.id, status: 'aberto' } });

        if (!evento) {
            return res.status(404).json({
                mensagem: 'Evento não encontrado.'
            });
        }

        return res.status(200).json(formatEvent(evento));
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao buscar evento.',
            erro: erro.message
        });
    }
}

async function criarEvento(req, res) {
    try {
        const body = req.body && typeof req.body === 'object' ? req.body : {};
        const {
            time_id,
            titulo,
            tipo,
            descricao,
            data,
            cidade,
            status,
            vagas_abertas
        } = body;
        if (
            !Number.isInteger(Number(time_id)) ||
            typeof titulo !== 'string' || !titulo.trim() || titulo.length > 100 ||
            !['evento', 'campeonato'].includes(tipo) ||
            typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data) ||
            typeof cidade !== 'string' || cidade.length > 100 ||
            !Number.isInteger(Number(vagas_abertas)) || Number(vagas_abertas) < 0
        ) {
            return res.status(400).json({ mensagem: 'Os dados do evento são inválidos.' });
        }
        const time = await Time.findOne({ where: { id: time_id, usuario_id: req.user.id } });
        if (!time) return res.status(403).json({ mensagem: 'Você não pode criar eventos para este time.' });

        const evento = await Evento.create({
            time_id: time.id,
            titulo: titulo.trim(),
            tipo,
            descricao,
            data,
            cidade,
            status: 'aberto',
            vagas_abertas: Number(vagas_abertas)
        });

        return res.status(201).json(formatEvent(evento));
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao criar evento.',
            erro: erro.message
        });
    }
}

async function atualizarEvento(req, res) {
    try {
        const evento = await Evento.findByPk(req.params.id, { include: [{ model: Time, attributes: ['usuario_id'] }] });

        if (!evento) return res.status(404).json({ mensagem: 'Evento não encontrado.' });
        if (evento.Time?.usuario_id !== req.user.id) return res.status(403).json({ mensagem: 'Você não pode editar este evento.' });

        const allowed = ['titulo', 'tipo', 'descricao', 'data', 'cidade', 'status', 'vagas_abertas'];
        const body = req.body && typeof req.body === 'object' ? req.body : {};
        const updates = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)));
        await evento.update(updates);

        return res.status(200).json(formatEvent(evento));
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao atualizar evento.',
            erro: erro.message
        });
    }
}

async function excluirEvento(req, res) {
    try {
        const evento = await Evento.findByPk(req.params.id, { include: [{ model: Time, attributes: ['usuario_id'] }] });

        if (!evento) return res.status(404).json({ mensagem: 'Evento não encontrado.' });
        if (evento.Time?.usuario_id !== req.user.id) return res.status(403).json({ mensagem: 'Você não pode excluir este evento.' });

        await evento.destroy();

        return res.status(200).json({
            mensagem: 'Evento excluído com sucesso.'
        });
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao excluir evento.',
            erro: erro.message
        });
    }
}

function formatEvent(evento) {
    return {
        id: String(evento.id),
        nome: evento.titulo || '',
        tipo: evento.tipo || 'evento',
        info: evento.descricao || '',
        datas: evento.data ? new Date(`${evento.data}T00:00:00`).toLocaleDateString('pt-BR') : '',
        local: evento.cidade || '',
        vagas: Number(evento.vagas_abertas || 0)
    };
}

module.exports = {
    listarEventos,
    buscarEvento,
    criarEvento,
    atualizarEvento,
    excluirEvento
};