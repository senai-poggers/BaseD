const express = require('express');
const { requireAuth } = require('../middleware/auth');

const {
    listarTimes,
    buscarTime,
    criarTime,
    atualizarTime,
    excluirTime
} = require('../controllers/timeController');

const router = express.Router();

router.get('/', listarTimes);
router.get('/:id', buscarTime);
router.post('/', requireAuth, criarTime);
router.put('/:id', requireAuth, atualizarTime);
router.delete('/:id', requireAuth, excluirTime);

module.exports = router;