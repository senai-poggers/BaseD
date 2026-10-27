const { Usuario } = require('../models');

async function listarUsuarios(req, res) {
    try {
        const usuarios = await Usuario.findAll({
            where: { id: req.user.id },
            attributes: ['id', 'nome', 'email', 'tipo_perfil', 'cidade']
        });

        return res.status(200).json(usuarios);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao buscar usuários.',
            erro: erro.message
        });
    }
}

async function buscarUsuario(req, res) {
    try {
        if (Number(req.params.id) !== req.user.id) {
            return res.status(403).json({ mensagem: 'Você só pode consultar a sua própria conta.' });
        }
        const usuario = await Usuario.findByPk(req.user.id, {
            attributes: ['id', 'nome', 'email', 'tipo_perfil', 'cidade']
        });

        if (!usuario) {
            return res.status(404).json({
                mensagem: 'Usuário não encontrado.'
            });
        }

        return res.status(200).json(usuario);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao buscar usuário.',
            erro: erro.message
        });
    }
}

async function criarUsuario(req, res) {
    return res.status(405).json({ mensagem: 'Use /api/auth/cadastro para criar uma conta.' });
}

async function atualizarUsuario(req, res) {
    try {
        if (Number(req.params.id) !== req.user.id) {
            return res.status(403).json({ mensagem: 'Você só pode atualizar a sua própria conta.' });
        }
        const usuario = await Usuario.findByPk(req.user.id);

        if (!usuario) {
            return res.status(404).json({
                mensagem: 'Usuário não encontrado.'
            });
        }

        const { nome, email, cidade } = req.body;
        const updates = {};
        if (typeof nome === 'string' && nome.trim() && nome.length <= 100) updates.nome = nome.trim();
        if (typeof email === 'string' && email.length <= 150) updates.email = email.trim().toLowerCase();
        if (typeof cidade === 'string' && cidade.length <= 100) updates.cidade = cidade.trim();
        if (!Object.keys(updates).length) return res.status(400).json({ mensagem: 'Nenhum campo válido para atualizar.' });
        await usuario.update(updates);
        return res.status(200).json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipo_perfil: usuario.tipo_perfil,
            cidade: usuario.cidade
        });
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao atualizar usuário.',
            erro: erro.message
        });
    }
}

async function excluirUsuario(req, res) {
    try {
        if (Number(req.params.id) !== req.user.id) {
            return res.status(403).json({ mensagem: 'Você só pode excluir a sua própria conta.' });
        }
        const usuario = await Usuario.findByPk(req.user.id);

        if (!usuario) {
            return res.status(404).json({
                mensagem: 'Usuário não encontrado.'
            });
        }

        await usuario.destroy();

        return res.status(200).json({
            mensagem: 'Usuário excluído com sucesso.'
        });
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao excluir usuário.',
            erro: erro.message
        });
    }
}

module.exports = {
    listarUsuarios,
    buscarUsuario,
    criarUsuario,
    atualizarUsuario,
    excluirUsuario
};