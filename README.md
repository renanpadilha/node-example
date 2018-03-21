# Especificação da API

API utilizando Node, Express e Knex com PostgreSQL

Para executar o projeto:

`npm install -g knex` (para utilzar o cli para geração do banco de dados, seeds e migrations)

`npm install`

`npm run server`


# Configuração
Para criar o banco de dados basta configurar o arquivo `knexfile.js` que está na raiz do projeto com os dados de acesso do Postgres.

Após configurar, basta executar o comando:

`knex migrate:latest --env development`

## Autenticação

Para o cliente se logar é necessário ter criado um cliente com seu respectivo usuário e senha.
Para realizar a autenticação do usuário é necessário o envio do usuário e senha no cabeçalho [Authorization] como tipo Basic Auth. 
Ao realizar login, o usuário recebe um **token** para realizar as demais requisições.

### POST /login
`HEADER Authorization: Username:Password`

### POST /logout
```
Header Authorization: Token=[TOKENDOUSUÁRIO]
```

## Locação de filmes

### POST /locacao

`Content-type: json`

```
Body
{
  id_filme: [IDDOFILME],
  id_cliente: [IDDOCLIENTE]
}
```

```
Response
{
  mensagem: 'Locação realizada com sucesso'
}
```

## Devolução

### POST /devolucao/:id_locacao

`Content-type:json`

```
Response
{
  mensagem: 'Devolução realizad com sucesso'
}
```


## Clientes

### POST /clientes

`Content-type: json`
```
Body
{
  nome: 'Teste',
  email: 'teste@gmail.com',
  senha: 'teste123'
}
``` 
```
Response
[
    {
        "id": 2,
        "nome": "Teste",
        "email": "teste@teste.com",
        "senha": "teste123",
        "token": "a45876a5-1bdc-4094-9534-1d9cd3714dca"
    }
]
``` 

### GET /clientes

`Content-type: json`
```
[
    {
        "id": 1,
        "nome": "Renan Padilha",
        "email": "renanpadilha@hotmail.com",
        "senha": "123",
        "token": "d63fdf86-ce86-4358-89aa-bd7f57f3455d"
    }
]
```

### GET /clientes/:id

`Content-type: json`
```
[
    {
        "id": 1,
        "nome": "Renan Padilha",
        "email": "renanpadilha@hotmail.com",
        "senha": "123",
        "token": "d63fdf86-ce86-4358-89aa-bd7f57f3455d"
    }
]
```

## Filmes

Para pesquisar um filme pelo **Título** ou **Diretor** basta adicionar uma query string na chamada

### GET /filmes?titulo=[NOMEDOTITULO]

`Content-type: json`


### GET /filmes?diretor=[NOMEDODIRETOR]

`Content-type: json`

### POST /filmes

`Content-type: json`
```
Body
{
  titulo: 'Harry Potter',
  diretor: 'Chris Columbus',
  quantidade: 4
}
``` 
```
Response
[
    {
      id: 6,
      titulo: 'Harry Potter',
      diretor: 'Chris Columbus',
      quantidade: 4
    }
]
``` 

### GET /filmes

`Content-type: json`
```
[
    {
        "id": 6,
        "titulo": "Os Vingadores",
        "diretor": "Joss Whedon",
        "quantidade": 1
    },
    {
        "id": 5,
        "titulo": "Harry Potter 1",
        "diretor": "Chris Columbus",
        "quantidade": 2
    }
]
```

### GET /filmes/:id


`Content-type: json` 
```
[
    {
        "id": 5,
        "titulo": "Harry Potter 1",
        "diretor": "Chris Columbus",
        "quantidade": 2
    }
]
```

