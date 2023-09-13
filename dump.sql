CREATE DATABASE dindin;

CREATE TABLE usuarios (
	id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL
);

CREATE TABLE categorias (
	id SERIAL PRIMARY KEY,
  descricao TEXT NOT NULL
);

CREATE TABLE transacoes (
	id SERIAL PRIMARY KEY,
  descricao TEXT NOT NULL,
  valor INTEGER NOT NULL,
  data DATE NOT NULL,
  categoria_id INTEGER REFERENCES categorias(id),
  usuario_id INTEGER REFERENCES usuarios(id),
  tipo TEXT NOT NULL
);

INSERT INTO categorias (descricao)
VALUES
('Alimentação'),
('Assinatura e Servicos'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Familía'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Sálario'),
('Vendas'),
('Outras receitas'),
('Outras despesas');