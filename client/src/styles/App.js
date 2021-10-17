import styled from 'styled-components';

export const Container = styled.div`
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    font-size: 32px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  input {
    width: 230px;
    padding: 10px;
    border: none;
    background: #f0f2f5;
    border-radius: 8px;
    outline: none;

    margin-bottom: 10px;
    color: #3e3e3e;
  }

  button {
    width: 100%;
    background: #33cc95;
    border: none;
    border-radius: 8px;
    padding: 10px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      filter: brightness(0.6);
    }
  }
`;

export const Title = styled.span`
  font-size: 24px;
  margin-bottom: 10px;
`;

export const Button = styled.button`
  width: 200px;
  color: #fff;
  background: #e52e4d;
  border: none;
  border-radius: 8px;
  padding: 10px;
  transition: 0.2s;
  margin: 10px;

  &:hover {
    filter: brightness(0.6);
  }
`;

export const Negative = styled.span`
  color: #e52e4d;
`;

export const Success = styled.span`
  color: #33cc95;
`;
