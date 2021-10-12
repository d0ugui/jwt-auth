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

//* Definindo porta da aplicação
app.listen(5000, () => {
  console.log('backend server is running...');
});
