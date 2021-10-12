const { json } = require('express');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

//* Definido JSON como formato a ser aceito nas requisições
app.use(express.json());

//* Criando mock de usuários locais para não utilizar database
const users = [
  {
    id: '1',
    username: 'dougui',
    password: 'douglas123',
    isAdmin: true
  },
  {
    id: '2',
    username: 'nocrazzy',
    password: 'douglas123',
    isAdmin: false
  }
];

//* Criando rota de login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  //* Recebendo os valores da requisição e verificando a existência
  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });

  if (user) {
    //* Gerando um token de acesso
    const acessToken = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, 'mySecretKey');
    res.json({
      username: user.username,
      isAdmin: user.isAdmin,
      acessToken
    });
  } else {
    res.status(400).json('Username or password incorrect!');
  }
});

//* Validando o token enviado no header da requisição (middleware)
const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, 'mySecretKey', (err, user) => {
      if (err) {
        return res.status(403).json('Token is not valid!');
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json('You are not authenticated!');
  }
};

//* Criando rota delete com middleware
app.delete('/api/users/:userId', verify, (req, res) => {
  if (req.user.id === req.params.userId || req.user.isAdmin) {
    res.status(200).json('User has been deleted!');
  } else {
    res.status(403).json('You are not allowed to delete this user!');
  }
});

//* Definindo porta da aplicação
app.listen(5000, () => {
  console.log('backend server is running...');
});
