const pool = require('../conexao-banco/conexao')

const validarIds = async ( req, res, next ) =>{
    const { id } = req.params

    try {
        const validarIdTransacao = await pool.query('select * from transacoes where id = $1', [id])

        if (validarIdTransacao.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Transação inexistente' })
        }
        const verificarIdUsuario = await pool.query('select * from transacoes where usuario_id = $1', [req.usuario.id])

        if (verificarIdUsuario.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Não pertence ao usuario logado ou id do usuario não existe.' })
        }
        next()
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ mensagem: "Erro interno no servidor" })
    }
}

module.exports = validarIds