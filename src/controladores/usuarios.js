const pool = require("../conexao-banco/conexao")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJwt')

const cadastroUsuario = async (req, res) => {
    const { nome, email, senha } = req.body

    try {
        if (!nome || !email || !senha) {
            return res.status(400).json({ mensagem: "Informe todos os campos obrigatorios." })
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const consultaEmail = await pool.query('select * from usuarios where email = $1', [email])

        if (consultaEmail.rowCount === 1) {
            return res.status(409).json({ mensagem: "Já existe usuário cadastrado com o e-mail informado." })
        }

        const queryCadastro = 'insert into usuarios (nome,email,senha) values ($1, $2, $3) returning *'

        const resultadoCadastro = await pool.query(queryCadastro, [nome, email, senhaCriptografada])

        const { senha: _, ...usuarioCadastrado } = resultadoCadastro.rows[0]

        return res.status(201).json(usuarioCadastrado)
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ mensagem: "Erro interno do servidor." })
    }
}

const loginUsuario = async (req, res) => {
    const { email, senha } = req.body

    try {
        if (!email || !senha) {
            return res.status(400).json({ mensagem: "Informe todos os campos obrigatorios." })
        }

        const consultaEmail = await pool.query('select * from usuarios where email = $1', [email])

        if (consultaEmail.rowCount < 1) {
            return res.status(404).json({ mensagem: "Conta não encontrada" })
        }

        const senhaValida = await bcrypt.compare(senha, consultaEmail.rows[0].senha)

        if (!senhaValida) {
            return res.status(401).json({ mensagem: "Usuário e/ou senha inválido(s)." })
        }

        const token = jwt.sign({ id: consultaEmail.rows[0].id }, senhaJwt, { expiresIn: '8h' })

        const { senha: _, ...usuarioLogado } = consultaEmail.rows[0]

        return res.json({ usuario: usuarioLogado, token })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ mensagem: "Erro interno do servidor." })
    }
}

const atualizarUsuario = async ( req, res ) =>{
    const {nome, email, senha} = req.body
    const { id } = req.usuario
    try {
        if (!nome || !email || !senha) {
            return res.status(400).json({ mensagem: "Informe todos os campos obrigatorios." })
        }

        const senhaCriptografa = await bcrypt.hash(senha,10)
        
        const consultaEmail = await pool.query ('select * from usuarios where email = $1',[email])
            
        if(consultaEmail.rowCount === 1){
            return res.status(409).json({mensagem: "Já existe usuário cadastrado com o e-mail informado."})
        }

        const atualizarDadosUsuario = 'update usuarios set nome = $1, email = $2, senha = $3 where id = $4'

        await pool.query(atualizarDadosUsuario, [nome, email, senhaCriptografa, id])

        res.status(204).send()
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ mensagem: "Erro interno no servidor" })
    }
}

const detalharPerfilLogado = async (req, res) => {
    const { id } = req.usuario;

    if (!id) {
        return res.status(404).json({ mensagem: 'Usuario nao encontrado' });
    }

    try {
        const query = `
            SELECT * FROM usuarios 
            WHERE id = $1
        `;

        const params = [id];

        const { rows, rowCount } = await pool.query(query, params);

        if (rowCount < 1) {
            return res.status(401).json({ mensagem: 'nao autorizado' });
        }

        const { senha: _, ...detalharPerfil } = rows[0]
        return res.status(200).json(detalharPerfil);
    } catch (error) {
        return res.status(401).json({ mensagem: 'nao autorizado' });
    }
}

const listarCategorias = async (req, res) => {
    const queryListarCategorias = await pool.query('select * from categorias;')

    return res.status(201).json(queryListarCategorias.rows)
}

module.exports = {
    cadastroUsuario,
    loginUsuario,
    detalharPerfilLogado,
    atualizarUsuario,
    listarCategorias
}