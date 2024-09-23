import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getStatus } from './api';

const Header = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toError = () => {
    navigate('/error');
  };

  getStatus(username)
  
  .then(status => {
    setStatus(status);
    console.log('User status:', status);
  })
  .catch(error => {
    console.error('Error getting user status:', error);
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      if (response.status === 200) {
        if (status == 'admin')
          navigate('/profile_admin');
        else
          navigate('/profile');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      toError();
    }
  };

  return (
    <header>
      <div className='heading'>Здоровье в корзине</div>
      <h1 className='heading'>Авторизация</h1>
      <div className='container'>
        <div className='login'>
          <div className='form'>
            <form>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Имя пользователя"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
              />
              <button onClick={handleLogin}>
                Войти
              </button>
              {error && <p>{error}</p>}
            </form>
          </div>
        </div>
      </div>
      <div class="navbar">
        <div class="thq-navbar-nav">
          <span>Журавская Е.В.<br></br>Теплякова Ю.Д.</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
