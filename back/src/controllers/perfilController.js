const { Usuario, Atleta, Conquista, FotoPerfil } = require('../models');

const imagePattern = /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/;

async function obterPerfil(req, res, next) {
    try {
        const usuario = await Usuario.findByPk(req.user.id, { attributes: ['id', 'nome', 'cidade', 'tipo_perfil'] });
        if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        const atleta = await Atleta.findOne({ where: { usuario_id: usuario.id } });
        return res.json({
            name: usuario.nome || '',
            city: usuario.cidade || '',
            sport: atleta?.esporte || '',
            position: atleta?.posicao || '',
            level: atleta?.nivel || '',
            bio: atleta?.descricao || '',
            avatar: atleta?.foto_url || null,
            type: usuario.tipo_perfil
        });
    } catch (error) {
        return next(error);
    }
}

async function atualizarPerfil(req, res, next) {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const { name, city, sport, position, level, bio, avatar } = body;
    if (
        typeof name !== 'string' || name.trim().length < 1 || name.length > 100 ||
        typeof city !== 'string' || city.length > 100 ||
        typeof sport !== 'string' || sport.length > 100 ||
        typeof position !== 'string' || position.length > 100 ||
        typeof level !== 'string' || level.length > 50 ||
        typeof bio !== 'string' || bio.length > 300 ||
        (avatar !== null && typeof avatar !== 'string') ||
        (typeof avatar === 'string' && (!imagePattern.test(avatar) || Buffer.byteLength(avatar) > 1400000))
    ) {
        return res.status(400).json({ mensagem: 'Os dados do perfil são inválidos.' });
    }
    try {
        const usuario = await Usuario.findByPk(req.user.id);
        if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        await usuario.update({ nome: name.trim(), cidade: city.trim() });
        const [atleta] = await Atleta.findOrCreate({
            where: { usuario_id: usuario.id },
            defaults: { usuario_id: usuario.id }
        });
        await atleta.update({
            esporte: sport.trim(),
            posicao: position.trim(),
            nivel: level.trim(),
            descricao: bio.trim(),
            foto_url: avatar
        });
        return res.json({
            name: usuario.nome,
            city: usuario.cidade,
            sport: atleta.esporte,
            position: atleta.posicao,
            level: atleta.nivel,
            bio: atleta.descricao,
            avatar: atleta.foto_url
        });
    } catch (error) {
        return next(error);
    }
}

async function listarFotos(req, res, next) {
    try {
        const photos = await FotoPerfil.findAll({
            where: { usuario_id: req.user.id },
            order: [['fixada', 'DESC'], ['id', 'DESC']]
        });
        return res.json(photos.map(photo => ({
            id: String(photo.id),
            image: photo.imagem,
            title: photo.titulo,
            description: photo.descricao,
            likes: photo.curtidas,
            liked: photo.curtida_pelo_usuario,
            pinned: photo.fixada
        })));
    } catch (error) {
        return next(error);
    }
}

async function criarFoto(req, res, next) {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const { image, title, description = '' } = body;
    if (
        typeof image !== 'string' || !imagePattern.test(image) || Buffer.byteLength(image) > 1400000 ||
        typeof title !== 'string' || !title.trim() || title.length > 60 ||
        typeof description !== 'string' || description.length > 240
    ) {
        return res.status(400).json({ mensagem: 'Os dados da foto são inválidos.' });
    }
    try {
        const photo = await FotoPerfil.create({
            usuario_id: req.user.id,
            imagem: image,
            titulo: title.trim(),
            descricao: description.trim()
        });
        return res.status(201).json({
            id: String(photo.id),
            image: photo.imagem,
            title: photo.titulo,
            description: photo.descricao,
            likes: photo.curtidas,
            liked: photo.curtida_pelo_usuario,
            pinned: photo.fixada
        });
    } catch (error) {
        return next(error);
    }
}

async function atualizarFoto(req, res, next) {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const { image, title, description } = body;
    if (
        typeof image !== 'string' || !imagePattern.test(image) || Buffer.byteLength(image) > 1400000 ||
        typeof title !== 'string' || !title.trim() || title.length > 60 ||
        typeof description !== 'string' || description.length > 240
    ) {
        return res.status(400).json({ mensagem: 'Os dados da foto são inválidos.' });
    }
    try {
        const photo = await FotoPerfil.findOne({ where: { id: req.params.id, usuario_id: req.user.id } });
        if (!photo) return res.status(404).json({ mensagem: 'Foto não encontrada.' });
        await photo.update({ imagem: image, titulo: title.trim(), descricao: description.trim() });
        return res.json({ id: String(photo.id), image: photo.imagem, title: photo.titulo, description: photo.descricao,
            likes: photo.curtidas, liked: photo.curtida_pelo_usuario, pinned: photo.fixada });
    } catch (error) {
        return next(error);
    }
}

async function atualizarAcaoFoto(req, res, next) {
    if (!['curtida', 'fixada'].includes(req.params.acao) || typeof req.body?.value !== 'boolean') {
        return res.status(400).json({ mensagem: 'Ação da foto inválida.' });
    }
    try {
        const photo = await FotoPerfil.findOne({ where: { id: req.params.id, usuario_id: req.user.id } });
        if (!photo) return res.status(404).json({ mensagem: 'Foto não encontrada.' });
        if (req.params.acao === 'curtida') {
            const delta = Number(req.body.value) - Number(photo.curtida_pelo_usuario);
            await photo.update({ curtida_pelo_usuario: req.body.value, curtidas: Math.max(0, photo.curtidas + delta) });
        } else {
            await photo.update({ fixada: req.body.value });
        }
        return res.json({
            id: String(photo.id), image: photo.imagem, title: photo.titulo, description: photo.descricao,
            likes: photo.curtidas, liked: photo.curtida_pelo_usuario, pinned: photo.fixada
        });
    } catch (error) {
        return next(error);
    }
}

async function excluirFoto(req, res, next) {
    try {
        const photo = await FotoPerfil.findOne({ where: { id: req.params.id, usuario_id: req.user.id } });
        if (!photo) return res.status(404).json({ mensagem: 'Foto não encontrada.' });
        await photo.destroy();
        return res.status(204).end();
    } catch (error) {
        return next(error);
    }
}

async function listarConquistas(req, res, next) {
    try {
        const achievements = await Conquista.findAll({ where: { usuario_id: req.user.id }, order: [['id', 'DESC']] });
        return res.json(achievements.map(achievement => ({
            id: String(achievement.id), title: achievement.titulo, type: achievement.tipo,
            place: achievement.local, year: achievement.ano
        })));
    } catch (error) {
        return next(error);
    }
}

async function salvarConquista(req, res, next) {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const { title, type, place = '', year = '' } = body;
    if (
        typeof title !== 'string' || !title.trim() || title.length > 80 ||
        !['Evento', 'Campeonato'].includes(type) ||
        typeof place !== 'string' || place.length > 60 ||
        typeof year !== 'string' || (year && !/^(19|20|21)\d{2}$/.test(year))
    ) {
        return res.status(400).json({ mensagem: 'Os dados da conquista são inválidos.' });
    }
    try {
        let achievement;
        if (req.params.id) {
            achievement = await Conquista.findOne({ where: { id: req.params.id, usuario_id: req.user.id } });
            if (!achievement) return res.status(404).json({ mensagem: 'Conquista não encontrada.' });
            await achievement.update({ titulo: title.trim(), tipo: type, local: place.trim(), ano: year });
        } else {
            achievement = await Conquista.create({
                usuario_id: req.user.id, titulo: title.trim(), tipo: type, local: place.trim(), ano: year
            });
        }
        return res.status(req.params.id ? 200 : 201).json({
            id: String(achievement.id), title: achievement.titulo, type: achievement.tipo,
            place: achievement.local, year: achievement.ano
        });
    } catch (error) {
        return next(error);
    }
}

async function excluirConquista(req, res, next) {
    try {
        const achievement = await Conquista.findOne({ where: { id: req.params.id, usuario_id: req.user.id } });
        if (!achievement) return res.status(404).json({ mensagem: 'Conquista não encontrada.' });
        await achievement.destroy();
        return res.status(204).end();
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    obterPerfil, atualizarPerfil, listarFotos, criarFoto, atualizarFoto, atualizarAcaoFoto, excluirFoto,
    listarConquistas, salvarConquista, excluirConquista
};
