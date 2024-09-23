import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createOrder, allMedicines, addOrderItem, findOrder, deleteOrder } from './api';


export default function Cart() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [Medicines, setMedicines] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [orderid, setOrderid] = useState(0);
  const [ordertotal, setOrderTotal] = useState(0);
  const username = localStorage.getItem('username');

  const goToProfile = () => {
    navigate('/profile');
  };

  const goToProfileandDelete = async () => {
    try {
      await deleteOrder(orderid);
      navigate('/profile');
    } catch (error) {
      setError(`CART: Ошибка при выводе лекарств: ${error.message}`)
      toError();
    }
  }

  const toError = () => {
    navigate('/error');
  };

  const updateQuantity = (medicineId, newQuantity) => {
    if (newQuantity >= 0) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [medicineId]: newQuantity,
      }));
    }
  };

  const addingOrderItem = async (medicineid, amount) => {
    try {
      setOrderTotal(await addOrderItem(medicineid, orderid, amount));
    } catch (error) {
      setError(`CART: Ошибка при выводе лекарств: ${error.message}`);
      toError();
    }
  }

  useEffect(() => {
    const handleNewOrder = async () => {
      const min = 10;
      const max = 99;
      let isUnique = false;
      let newid = 0;

      do {
        newid = Math.floor(Math.random() * (max - min + 1)) + min;
        const existingID = await findOrder(newid);
        if (!existingID) {
          isUnique = true;
        }
      } while (!isUnique);
      setOrderid(newid);

      try {
        await createOrder(newid, username);
      } catch (error) {
        setError(`CART: Ошибка при создании заказа: ${error.message}`);
        toError();
      }
    }
    handleNewOrder();

    const showallMedicines = async () => {
      try {
        const medicine = await allMedicines();
        setMedicines(medicine);
      } catch (error) {
        setError(`CART: Ошибка при выводе лекарств: ${error.message}`);
        toError();
      }
    }
    showallMedicines();
  }, []);

  return (
    <div>
      <h1 className='heading'>Ваша Корзина</h1>
      <div className='container'>
        <ul>
          <table className='table'>
            <thead>
              <tr>
                <th>Название товара</th>
                <th>Цена</th>
                <th colSpan="3">Количество</th>
              </tr>
            </thead>
            {error ? (
              <tbody><p>{error}</p></tbody>
            ) : (
              Medicines.map(med => (
                <tbody key={med.medicineid}>
                  <tr>
                    <td>{med.medicineid}</td>
                    <td>{med.price}</td>
                    <td colSpan="3">
                      <input
                        type="number"
                        value={quantities[med.medicineid] || 0}
                        onChange={(e) => updateQuantity(med.medicineid, e.target.value)}
                      />
                    </td>
                    <td>
                      <button onClick={() => addingOrderItem(med.medicineid, quantities[med.medicineid])}>
                        Добавить
                      </button>
                    </td>
                  </tr>
                </tbody>

              ))
            )}
            <tfoot>
              <tr>
                <th scope="row" colSpan="3">Общая сумма: {ordertotal} руб.</th>
                <td>
                  <button onClick={goToProfile}>
                    Оформить заказ
                  </button></td>
              </tr>
            </tfoot>

          </table>
        </ul>
      </div>
      <div className="navbar">
        <div className="thq-navbar-nav">
          <span>© Здоровье в корзине</span>
          <button className="back" onClick={goToProfileandDelete}>
            Назад в профиль
          </button>
        </div>
      </div>
    </div>
  )
}
