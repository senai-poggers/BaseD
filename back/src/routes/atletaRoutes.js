const express = require('express');

const {
    listarAtletas,
    buscarAtleta,
    criarAtleta,
    atualizarAtleta,
    excluirAtleta
} = require('../controllers/atletaController');

const router = express.Router();

router.get('/', listarAtletas);
router.get('/:id', buscarAtleta);
router.post('/', criarAtleta);
router.put('/:id', atualizarAtleta);
router.delete('/:id', excluirAtleta);

module.exports = router;