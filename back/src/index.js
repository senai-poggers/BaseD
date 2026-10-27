const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
const { assertSecretConfigured, requireAuth } = require('./middleware/auth');

app.use(cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) : true
}));
app.use(express.json({ limit: '2mb' }));

const authRoutes = require('./routes/authRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const preferenciaRoutes = require('./routes/preferenciaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const atletaRoutes = require('./routes/atletaRoutes');
const timeRoutes = require('./routes/timeRoutes');
const vagaRoutes = require('./routes/vagaRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const inscricaoEventoRoutes = require('./routes/inscricaoEventoRoutes');
const candidaturaRoutes = require('./routes/candidaturaRoutes');
const matchRoutes = require('./routes/matchRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/preferencias', preferenciaRoutes);
app.use('/api/usuarios', requireAuth, usuarioRoutes);
app.use('/api/atletas', requireAuth, atletaRoutes);
app.use('/api/times', timeRoutes);
app.use('/api/vagas', vagaRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/inscricoes-eventos', requireAuth, inscricaoEventoRoutes);
app.use('/api/candidaturas', requireAuth, candidaturaRoutes);
app.use('/api/matches', requireAuth, matchRoutes);

app.get('/api', (req, res) => {
    res.json({
        mensagem: 'API BASED funcionando!'
    });
});

app.use((req, res) => res.status(404).json({ mensagem: 'Rota da API não encontrada.' }));

app.use((error, req, res, next) => {
    console.error('Erro na API:', error);
    if (res.headersSent) return next(error);
    const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 500
        ? error.status
        : 500;
    const mensagem = status === 413 ? 'O arquivo enviado excede o limite permitido.' :
        status === 400 ? 'A requisição contém JSON inválido.' :
        'Ocorreu um erro interno na API.';
    return res.status(status).json({ mensagem });
});

if (require.main === module) {
    const PORTA = Number(process.env.PORT || 3000);
    assertSecretConfigured();
    app.listen(PORTA, () => {
        console.log(`Servidor rodando na porta ${PORTA}`);
    });
}

module.exports = app;