const express = require('express');
const { requireAuth } = require('../middleware/auth');
const {
    obterPerfil, atualizarPerfil, listarFotos, criarFoto, atualizarFoto, atualizarAcaoFoto, excluirFoto,
    listarConquistas, salvarConquista, excluirConquista
} = require('../controllers/perfilController');

const router = express.Router();
router.use(requireAuth);
router.get('/', obterPerfil);
router.put('/', atualizarPerfil);
router.get('/fotos', listarFotos);
router.post('/fotos', criarFoto);
router.put('/fotos/:id', atualizarFoto);
router.patch('/fotos/:id/:acao', atualizarAcaoFoto);
router.delete('/fotos/:id', excluirFoto);
router.get('/conquistas', listarConquistas);
router.post('/conquistas', salvarConquista);
router.put('/conquistas/:id', salvarConquista);
router.delete('/conquistas/:id', excluirConquista);

module.exports = router;
