const pool = require("../conexao-banco/conexao");

const listarTransacoes = async (req, res) => {
    const { filtro } = req.query;
    const { id } = req.usuario;

    const categorias = [];
    const resultado = [];
    try {
        if (!filtro) {
            const query = `SELECT * FROM transacoes`;

            const { rows } = await pool.query(query);

            return res.status(200).json(rows);
        }

        for (let i = 0; i < filtro.length; i++) {
            const { rows } = await pool.query(` SELECT id FROM categorias WHERE descricao = $1`, [filtro[i]]);
            categorias.push(rows[0]);
        }

        const query = `
        SELECT *, c.descricao as categoria_nome FROM transacoes t LEFT JOIN categorias c ON c.id = t.categoria_id WHERE categoria_id = $1 AND usuario_id = $2 IS NOT NULL
        `
        for (let i = 0; i < categorias.length; i++) {
            const { rows, rowCount } = await pool.query(query, [categorias[i].id, id]);
            if (rowCount > 0) {
                resultado.push(rows[0]);
            }
        }
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }

}

const detalharTransacaoUsuarioLogado = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `SELECT t.id, t.tipo, 
        t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao AS categoria_nome 
        FROM transacoes t 
        LEFT JOIN categorias c ON t.categoria_id = c.id
        Where t.id = $1 AND t.usuario_id = $2`

        const detalharTransacaoResultado = await pool.query(query, [id, req.usuario.id])

        return res.status(201).json(detalharTransacaoResultado.rows[0]);
    } catch (error) {
        return res.status(500).json({ mensagem: 'erro interno do servidor' });
    }
}

const cadastrarTransacao = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ mensagem: 'favor inserir todos os campos obrigatorios' });
    }

    if (tipo !== 'entrada' && tipo !== 'saida') {
        return res.status(400).json({ mensagem: 'favor informar se o tipo de transacao é entrada ou saida ' });
    }

    try {

        const validarCategoriaId = await pool.query('select * from categorias where id = $1', [categoria_id])

        if (validarCategoriaId.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Categoria não encontrada.' })
        }

        const query = `INSERT INTO transacoes (descricao, valor, data, categoria_id, tipo, usuario_id)
            VALUES
            ($1, $2, $3, $4, $5, $6) returning *`;

        const params = [descricao, valor, data, categoria_id, tipo, req.usuario.id];

        const { rows, rowCount } = await pool.query(query, params);

        if (rowCount < 1) {
            return res.status(400), json({ mensagem: 'Requisicao invalida' });
        }

        const categoriaNome = await pool.query('select * from categorias where id = $1', [categoria_id])

        const resultado = {
            id: rows[0].id,
            tipo: rows[0].tipo,
            descricao: rows[0].descricao,
            valor: rows[0].valor,
            data: rows[0].data,
            usuario_id: rows[0].usuario_id,
            categoria_id: rows[0].categoria_id,
            categoria_nome: categoriaNome.rows[0].descricao
        }

        return res.status(201).json(resultado);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

const atualizarTransacaoUsuarioLogado = async (req, res) => {
    const { id } = req.params
    const { descricao, valor, data, categoria_id, tipo } = req.body

    try {

        if (!descricao || !valor || !data || !categoria_id || !tipo) {
            return res.status(400).json({ mensagem: 'favor inserir todos os campos obrigatorios' })
        }

        if (tipo !== 'entrada' && tipo !== 'saida') {
            return res.status(400).json({ mensagem: 'favor informar se o tipo de transacao é entrada ou saida ' });
        }

        const atualizarTransacao = 'update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where id = $6'

        await pool.query(atualizarTransacao, [descricao, valor, data, categoria_id, tipo, id])

        res.status(204).send()
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno no servidor" })
    }
}

const excluirTransacaoUsuarioLogado = async (req, res) => {
    const { id } = req.params

    try {
        const deletarTransacao = await pool.query('delete from transacoes where id = $1', [id])

        return res.status(204).send(deletarTransacao)
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno no servidor" })
    }
}

const obterExtrato = async (req, res) => {
    
    try {
        const query = await pool.query('select * from transacoes where usuario_id = $1',[req.usuario.id])
        
        const { rows } = query
        let totalEntrada = 0;
        let totalSaida = 0;

        for (transacao of rows) {
            if (transacao.tipo === 'entrada') {
                totalEntrada += transacao.valor;
            }

            if (transacao.tipo === 'saida') {
                totalSaida += transacao.valor;
            }
        }

        if(totalEntrada !== 0 || totalSaida !== 0){
            return res.status(200).json({mensagem: {Entrada: totalEntrada, saida: totalSaida}})
        }else{
            return res.status(200).json({mensagem: {Entrada: 0, saida: 0}})
        }
    } catch (error) {   
        return res.json(error);
    }
}

module.exports = {
    listarTransacoes,
    detalharTransacaoUsuarioLogado,
    cadastrarTransacao,
    atualizarTransacaoUsuarioLogado,
    excluirTransacaoUsuarioLogado,
    obterExtrato,
}