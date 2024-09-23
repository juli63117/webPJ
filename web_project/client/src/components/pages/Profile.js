import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrdersByUser } from './api';

export default function Profile() {
  const navigate = useNavigate();
  const [OrderTables, setOrderTables] = useState([]);
  const [error, setError] = useState(null);
  const username = localStorage.getItem('username');

  const goToHome = () => {
    navigate('/'); // Путь к домашней странице
  };

  const goToCart = () => {
    navigate('/cart'); // Путь к странице корзины
  };

  const toError = () => {
    navigate('/error');
  };

  useEffect(() => {
    const fetchOrderTables = async () => {
      try {
        if (username) {
          const OrderTablesData = await getOrdersByUser(username); // Передаем username
          setOrderTables(OrderTablesData);
        } else {
          setError('Пользователь не авторизован');
        }
      } catch (err) {
        toError();
      }
    };
    fetchOrderTables();
  }, [username]);

  return (
    <div>
      <h1 className='heading'>Профиль пользователя</h1>
      <h2>Имя пользователя: {username}</h2>
      <div className='container'>
        <div className="buttons-profile">
          <button onClick={goToCart}>
            Новый заказ
          </button>
        </div>
        {error ? (<p>{error}</p>) : (
          <ul>
            <br></br>
            <strong>ID заказа</strong>, <strong>Дата заказа</strong>, <strong>Статус заказа</strong>, <strong>Стоимость</strong>
            {OrderTables.map(order => (
              <li key={order.orderid}>{order.orderid}, {order.orderdate}, {order.orderstatus}, {order.orderprice} руб.</li>
            ))}
          </ul>
        )}
      </div>
      <div className="navbar">
        <div className="thq-navbar-nav">
          <span>© Здоровье в корзине </span>
          <button className='back' onClick={goToHome}>
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}