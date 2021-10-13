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

let refreshTokens = [];

//* Rota de criação de novo token de acesso e refresh token
app.post('/api/refresh', (req, res) => {
  //* Captura o refresh token do usuário
  const refreshToken = req.body.token;

  //* Mensagem de erro (token inválido ou não existe)
  if (!refreshToken) return res.status(401).json('You are not authenticated!');
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json('Refresh Token is not valid!');
  }

  //* Verificando erro e removendo refreshToken do mock
  jwt.verify(refreshToken, 'myRefreshSecretKey', (err, user) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    //* Criando novo access token e refresh token
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    //* Colocando o novo refresh token dentro do mock
    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  });

  //* Se verdadeiro, criar novo token de acesso, refresh token e enviar ao usuário
});

// * Gerando um token de acesso
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, 'mySecretKey', {
    expiresIn: '5s'
  });
};

// * Gerando um refresh token
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, 'myRefreshSecretKey');
};

//* Criando rota de login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  //* Recebendo os valores da requisição e verificando a existência
  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });

  if (user) {
    //* Chamando as funções responsáveis por gerar os tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    //* Após gerar o refresh token, colocando o dentro do mock
    refreshTokens.push(refreshToken);

    res.json({
      username: user.username,
      isAdmin: user.isAdmin,
      accessToken,
      refreshToken
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

//* Rota de logout
app.post('/api/logout', verify, (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.status(200).json('You logged out successfully.');
});

//* Definindo porta da aplicação
app.listen(5000, () => {
  console.log('backend server is running...');
});
