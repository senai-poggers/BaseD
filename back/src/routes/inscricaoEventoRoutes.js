const express = require('express');

const {
    listarInscricoes,
    buscarInscricao,
    criarInscricao,
    atualizarInscricao,
    excluirInscricao
} = require('../controllers/inscricaoEventoController');

const router = express.Router();

router.get('/', listarInscricoes);
router.get('/:id', buscarInscricao);
router.post('/', criarInscricao);
router.put('/:id', atualizarInscricao);
router.delete('/:id', excluirInscricao);

module.exports = router;