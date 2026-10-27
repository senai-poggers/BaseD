const { admin } = require('../supabase');

async function requireAuth(req, res, next) {
    const authorization = req.get('authorization') || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (!token) return res.status(401).json({ mensagem: 'Autenticação necessária.' });

    try {
        const { data, error } = await admin.auth.getUser(token);
        if (error || !data.user) return res.status(401).json({ mensagem: 'Sessão inválida ou expirada.' });
        req.user = data.user;
        return next();
    } catch (error) {
        return next(error);
    }
}

module.exports = { requireAuth };
