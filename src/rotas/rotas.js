const express = require('express')

const {
    cadastroUsuario,
    loginUsuario,
    detalharPerfilLogado,
    atualizarUsuario,
    listarCategorias
} = require('../controladores/usuarios')

const verificarUsuarioLogado = require('../intermediarios/autenticacao')

const {
    detalharTransacaoUsuarioLogado,
    listarTransacoes,
    cadastrarTransacao,
    obterExtrato,
    atualizarTransacaoUsuarioLogado,
    excluirTransacaoUsuarioLogado,
} = require('../controladores/transacoes')

const validarIds = require('../utilitarios/validarIDs')

const rotas = express()

rotas.post('/usuario', cadastroUsuario)
rotas.post('/login', loginUsuario)

rotas.use(verificarUsuarioLogado);

rotas.get('/usuario', detalharPerfilLogado);
rotas.put('/usuario', atualizarUsuario)
rotas.get('/categoria', listarCategorias)
rotas.get('/transacao/extrato', obterExtrato);
rotas.get('/transacao', listarTransacoes)
rotas.get('/transacao/:id',validarIds, detalharTransacaoUsuarioLogado)
rotas.post('/transacao', cadastrarTransacao)
rotas.put('/transacao/:id', validarIds, atualizarTransacaoUsuarioLogado)
rotas.delete('/transacao/:id', validarIds, excluirTransacaoUsuarioLogado)

module.exports = rotas