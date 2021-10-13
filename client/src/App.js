import { GlobalStyle } from './styles/GlobalStyle';

function App() {
  return (
    <div className="login">
      <form action="">
        <input type="text" placeholder="username" />
        <input type="password" placeholder="password" />
        <button type="submit">Login</button>
      </form>
      <GlobalStyle />
    </div>
  );
}

export default App;
