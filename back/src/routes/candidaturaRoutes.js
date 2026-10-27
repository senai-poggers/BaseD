const express = require('express');

const {
    listarCandidaturas,
    buscarCandidatura,
    criarCandidatura,
    atualizarCandidatura,
    excluirCandidatura
} = require('../controllers/candidaturaController');

const router = express.Router();

router.get('/', listarCandidaturas);
router.get('/:id', buscarCandidatura);
router.post('/', criarCandidatura);
router.put('/:id', atualizarCandidatura);
router.delete('/:id', excluirCandidatura);

module.exports = router;