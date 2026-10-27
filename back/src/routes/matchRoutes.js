const express = require('express');

const {
    listarMatches,
    buscarMatch,
    criarMatch,
    atualizarMatch,
    excluirMatch
} = require('../controllers/matchController');

const router = express.Router();

router.get('/', listarMatches);
router.get('/:id', buscarMatch);
router.post('/', criarMatch);
router.put('/:id', atualizarMatch);
router.delete('/:id', excluirMatch);

module.exports = router;