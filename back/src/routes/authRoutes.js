const express = require('express');
const { cadastrar, entrar } = require('../controllers/authController');

const router = express.Router();

router.post('/cadastro', cadastrar);
router.post('/login', entrar);

module.exports = router;
