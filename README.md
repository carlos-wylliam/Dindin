# Dindin :money_with_wings:
O "Dindin" foi desenvolvido como um projeto de aprendizado para simular um sistema bancário, permitindo que os usuários controlem suas finanças pessoais por meio do registro de transações financeiras, consultem seus extratos e atualizem seus perfis de usuário. Este projeto segue o padrão REST e utiliza o framework Express.js para criação das APIs.

### Configuração do Ambiente
Antes de utilizar o "Dindin", certifique-se de que o ambiente esteja corretamente configurado. Você precisará ter instalado:
- Node.js
- PostgreSQL

Além disso, é importante criar um banco de dados PostgreSQL chamado "Dindin" e configurar o arquivo conexao-banco/conexao.js com as informações de conexão ao banco de dados, o arquivo com a criação do banco de dados está disponivel no arquivo dump.sql.

### Funcionalidades
O "Dindin" oferece as seguintes funcionalidades:

### 1. Autenticação de Usuário
- Cadastro de usuário com nome, email e senha.
- Login de usuário, gerando um token JWT para autenticação.

### 2. Perfil de Usuário
- Detalhamento do perfil do usuário logado.
- Atualização de dados do perfil (nome, email e senha).

### 3. Transações Financeiras
- Listagem de todas as transações financeiras do usuário.
- Listagem de transações por categoria.
- Detalhamento de uma transação específica.
- Cadastro de uma nova transação.
- Atualização de uma transação existente.
- Exclusão de uma transação.

### 4. Categorias
- Listagem de todas as categorias disponíveis.

### 5. Extrato Financeiro
- Consulta do extrato financeiro do usuário, com o total de entradas e saídas.

## Utilização
1. para utilizar o "Dindin", siga as etapas abaixo:
2. Certifique-se de que o ambiente está configurado conforme mencionado acima.
3. Execute o comando npm install para instalar as dependências do programa.
4. Inicie o programa executando o comando npm start. O programa estará disponível em http://localhost:3000.
5. Utilize as rotas definidas no programa para interagir com as funcionalidades. Você pode utilizar um cliente HTTP (como o Insomnia ou Postman) para fazer requisições às rotas.

## Exemplo de Uso
POST/usuario
Corpo da requisição:

- Para cadastrar um novo úsuario:
```javascript
// POST /usuario
{
    "nome": "Nome do usuario",
    "email": "email@example.com",
    "senha": "123456"
}
```

- Para fazer login e obter um token JWT:

```javascript
// POST /login
{
    "email": "email@example.com",
    "senha": "senha123"
}
```

- Para listar todas as transações financeiras:

```javascript
// GET /transacao
```

- Para cadastrar uma nova transação:

```javascript
// POST /transacao
corpo da requisição:
{
  "descricao": "Compra no mercado",
  "valor": 50.00,
  "data": "2023-09-11",
  "categoria_id": 1,
  "tipo": "saida"
}
```
- Para consultar o extrato financeiro:

```javascript
// GET /transacao/extrato
```

Lembre-se de incluir o token JWT obtido após o login nas requisições autenticadas.
