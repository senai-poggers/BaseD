const express = require('express');
const { requireAuth } = require('../middleware/auth');

const {
    listarEventos,
    buscarEvento,
    criarEvento,
    atualizarEvento,
    excluirEvento
} = require('../controllers/eventoController');

const router = express.Router();

router.get('/', listarEventos);
router.get('/:id', buscarEvento);
router.post('/', requireAuth, criarEvento);
router.put('/:id', requireAuth, atualizarEvento);
router.delete('/:id', requireAuth, excluirEvento);

module.exports = router;