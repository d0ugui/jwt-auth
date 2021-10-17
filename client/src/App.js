import { useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import { GlobalStyle } from './styles/GlobalStyle';
import { Container, Form, Button, Title, Negative, Success } from './styles/App';

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  //* Gerando um novo refreshToken
  const refreshToken = async () => {
    try {
      const res = await axios.post('/refresh', { token: user.refreshToken });
      setUser({
        ...user,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodedToken = jwt_decode(user.accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshToken();
        config.headers['authorization'] = 'Bearer ' + data.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  //* Capturando dados inseridos nos inputs e setando nos estados
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/login', { username, password });
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //* Deletando o usuário e validando a autorização com accessToken
  const handleDelete = async (id) => {
    setSuccess(false);
    setError(false);
    try {
      await axiosJWT.delete('/users/' + id, {
        headers: { authorization: 'Bearer ' + user.accessToken }
      });
      setSuccess(true);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="container">
      {user ? (
        <Container>
          <Title>
            Welcome to the <b>{user.isAdmin ? 'admin' : 'user'}</b> dashboard{' '}
            <b>{user.username}</b>.
          </Title>
          <span>Delete Users:</span>
          <Button className="deleteButton" onClick={() => handleDelete(1)}>
            Delete dougui
          </Button>
          <Button className="deleteButton" onClick={() => handleDelete(2)}>
            Delete nocrazzy
          </Button>
          {error && (
            <Negative className="error">
              You are not allowed to delete this user!
            </Negative>
          )}
          {success && (
            <Success className="success">User has been deleted successfully...</Success>
          )}
        </Container>
      ) : (
        <Container>
          <Form onSubmit={handleSubmit}>
            <span className="formTitle">Login</span>
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="submitButton">
              Login
            </button>
          </Form>
        </Container>
      )}
      <GlobalStyle />
    </div>
  );
}

export default App;
