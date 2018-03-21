import express from 'express';
import bodyParser from 'body-parser';
import knex from './db';
import bcrypt from 'bcrypt';

const port = process.env.PORT || 8080;
const app = express();
const router = express.Router();

app.use(router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Location, Authorization');
  res.setHeader('Access-Control-Expose-Headers', 'Location');
  next();
});


const auth = async(req, res, next) => {
  let authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401);
  }

  let parts = authorization.trim().split(' ');

  switch (parts[0]) {
    case 'Basic':
      let secret = new Buffer(parts[1], 'base64').toString();
      let credentials = secret.split(':');

      let basicUser = await getUsuarioByCredentials(credentials);
      if (basicUser.length === 0) {
        return res.sendStatus(401);
      }
      req.user = basicUser[0];
      next();
      break;
      
    case 'Token':
      let token = parts[1].split('=')[1];
      let tokenUser = await getUsuarioByToken(token);

      if (tokenUser.length === 0) {
        return res.sendStatus(401);
      }
      req.user = tokenUser[0];
      next();
      break;

    default:
      res.sendStatus(401);
      break;
  }
}

const getUsuarioByCredentials = credentials => {
  return knex.select("*").from('clientes').where({ email: credentials[0], senha: credentials[1] });
}

const getUsuarioByToken = token => {
  return knex.select("*").from('clientes').where({ token: token });
}

app.get('/health', (req, res) => {
  res.send('Bem vindo a API');
});

app.post('/api/v1/login', auth, async(req, res, next) => {
  let parts = req.headers.authorization.trim().split(' ');
  let secret = new Buffer(parts[1], 'base64').toString();
  let credentials = secret.split(':');

  let cliente = await knex.select("*").from('clientes').where({ email: credentials[0] });
  if(cliente[0].token) {
    res.json({ token1: cliente[0].token })
  } else {
    knex('clientes').where({ id: cliente[0].id }).update({ token: knex.raw('uuid_generate_v4()') }).returning('token')
    .then(response => {
      res.json({token: response[0]});
    })
    .catch(err => {
      res.json({ erro: 'senha inválida catch1' })
    })
  }
});

app.post('/api/v1/logout', (req, res) => {
  let token = req.headers.authorization.split('=')[1];

  knex('clientes').where({token: token}).update({token: null})
    .then(response => {
      res.json({mensagem: 'Logout realizado'});
    })
    .catch(err => {
      res.json({ mensagem: 'Erro ao realizar logout' });
    })
});

app.post('/api/v1/locacao', auth, async(req, res) => {
  let locacao = {
    id_cliente: req.body.id_cliente,
    id_filme: req.body.id_filme,
    devolvido: false
  };

  const filme = await knex.select('*').from('filmes').where({ id: locacao.id_filme});

  if(filme[0].quantidade < 1) {
    return res.json({erro: 'Filme sem disponibilidade'})
  } else {
    knex.insert(locacao).into('locacoes')
    .then(locacao => {
      knex('filmes').where({id: filme[0].id}).update({quantidade: filme[0].quantidade - 1})
      .then(locado => {
        res.json({mensagem: 'Filme locado com sucesso'})
      })
    })
    .catch(err => {
      res.status(500).json(err);
    })
  }
});

app.post('/api/v1/devolucao/:id_locacao', auth, async(req, res) => {
  
  const locacao = await knex.select('*').from('locacoes').where({ id: req.params.id_locacao });
  if(locacao[0].devolvido === true) {
    return res.json({ erro: 'Filme já foi devolvido' });
  } else {
    knex('locacoes').where({id: req.params.id_locacao}).update({devolvido: true})
    .then(response => {
      knex('filmes').where({ id: locacao[0].id_filme }).update({ quantidade: knex.raw('quantidade + 1') })
        .then(locado => {
          res.json({ mensagem: 'Filme devolvido com sucesso' })
        });
    })
    .catch(err => {
      res.status(500).json(err);
    }) 
  }
});

app.get('/api/v1/clientes', (req, res) => {
  knex.select("*").from('clientes')
    .then(clientes => {
      res.json(clientes);
    })
    .catch(err => {
      res.status(400).json(err);
    })
});

app.get('/api/v1/clientes/:id', (req, res) => {
  knex.select("*").from('clientes').where({
      id: req.params.id
    })
    .then(cliente => {
      res.json(cliente);
    })
    .catch(err => {
      res.status(400).json(err);
    })
});

app.post('/api/v1/clientes', (req, res) => {
  let cliente = {
    nome: req.body.nome,
    email: req.body.email,
    senha: req.body.senha,
    token: knex.raw('uuid_generate_v4()')
  };

  knex.insert(cliente).into('clientes').returning('*')
    .then(cliente => {
      res.status(201).json(cliente);
    })
    .catch(err => {
      res.status(400).json(err);
    })
  
});

app.get('/api/v1/filmes', (req, res, next) => {

  if(req.query.titulo) {
    knex.select("*").from('filmes').where('titulo', 'like', `%${req.query.titulo}%`)
      .then(filmes => {
        res.send(filmes);
      })
      .catch(err => {
        res.status(400).json(err);
      })
  } else if (req.query.diretor) {
    knex.select("*").from('filmes').where('diretor', 'like', `%${req.query.diretor}%`)
      .then(filmes => {
        res.send(filmes);
      })
      .catch(err => {
        res.status(400).json(err);
      })
  } else {
    knex.select("*").from('filmes')
      .then(filmes => {
        res.send(filmes);
      })
      .catch(err => {
        res.status(400).json(err);
      })
  }
});

app.post('/api/v1/filmes', (req, res) => {
  let filme = {
    titulo: req.body.titulo,
    diretor: req.body.diretor,
    quantidade: req.body.quantidade
  };

  knex.insert(filme).into('filmes').returning('*')
    .then(filme => {
      res.status(201).json(filme);
    })
    .catch(err => {
      res.status(400).json(err);
    })

});

app.get('/api/v1/filmes/:id', (req, res) => {
  knex.select("*").from('filmes').where({
      id: req.params.id
    })
    .then(filme => {
      res.json(filme);
    })
    .catch(err => {
      res.status(400).json(err);
    })
});


app.listen(port);