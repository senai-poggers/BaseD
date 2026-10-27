const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { obter, atualizar, restaurar } = require('../controllers/preferenciaController');

const router = express.Router();
router.use(requireAuth);
router.get('/', obter);
router.put('/', atualizar);
router.delete('/', restaurar);

module.exports = router;
