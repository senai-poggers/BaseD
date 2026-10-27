const express = require('express');

const {
    listarUsuarios,
    buscarUsuario,
    criarUsuario,
    atualizarUsuario,
    excluirUsuario
} = require('../controllers/usuarioController');

const router = express.Router();

router.get('/', listarUsuarios);
router.get('/:id', buscarUsuario);
router.post('/', criarUsuario);
router.put('/:id', atualizarUsuario);
router.delete('/:id', excluirUsuario);

module.exports = router;