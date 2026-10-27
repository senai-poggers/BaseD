const express = require('express');
const { requireAuth } = require('../middleware/auth');

const {
    listarVagas,
    buscarVaga,
    criarVaga,
    atualizarVaga,
    excluirVaga
} = require('../controllers/vagaController');

const router = express.Router();

router.get('/', listarVagas);
router.get('/:id', buscarVaga);
router.post('/', requireAuth, criarVaga);
router.put('/:id', requireAuth, atualizarVaga);
router.delete('/:id', requireAuth, excluirVaga);

module.exports = router;