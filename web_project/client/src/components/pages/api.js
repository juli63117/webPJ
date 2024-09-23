import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const getOrdersByUser = async (username) => {
  try {
    if (!username) {
      throw new Error('Пользователь не авторизован');
    }
    const url = `${API_URL}/ordertables/${username}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const findOrder = async (orderid) => {
  try {
    if (!orderid) {
      throw new Error('Нет orderid');
    }
    const url = `${API_URL}/ordertables/findorder/${orderid}`; // Добавляем orderid в URL
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error finding order:', error);
    throw error;
  }
};


export const createOrder = async (orderid, username) => {
  try {
    if (!username) {
      throw new Error('Пользователь не авторизован');
    }
    if (!orderid) {
      throw new Error('Нет orderid');
    }
    const response = await axios.post(`${API_URL}/ordertables/createorder/${orderid}/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const deleteOrder = async (orderid) => {
  try {
    if (!orderid) {
      throw new Error('Нет orderid');
    }
    const response = await axios.post(`${API_URL}/orderitem/delorder/${orderid}`);
    return response.data;
  } catch (error) {
    console.error('Error DELETING order:', error);
    throw error;
  }
};

export const allMedicines = async () => {
  try {
    const url = `${API_URL}/medicines`;
    const response = await axios.get(url); // Передаем username в теле запроса
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const addOrderItem = async (medicineid, orderid, amount) => {
  try {
    const url = `${API_URL}/orderitem`;
    const response = await axios.post(url, {
      medicineid: medicineid,
      orderid: orderid,
      amount: amount
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const login = async (username, password) => { // Добавляем параметры
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password
    });
    if (response.status === 200) {
      localStorage.setItem('username', username); // Сохраняем имя в localStorage
    }
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const getMedicinesByTotalQuantityOrdered = async () => {
  try {
    const response = await axios.get(`${API_URL}/getMedicines`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const getMostActiveUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/getUsers`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const getStatus = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/users/status?username=${username}`);
    return response.data.status;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};