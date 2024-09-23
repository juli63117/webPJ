import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMedicinesByTotalQuantityOrdered, getMostActiveUser } from './api.js'

export default function Profile_admin() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const [error, setError] = useState(null);
    const [Medicines, setMedicines] = useState([]);
    const [Users, setUsersData] = useState([]);

    const goToHome = () => {
        navigate('/');
    };
    const toError = () => {
        navigate('/error');
    };

    useEffect(() => {
        const fetchMedicinesByTotal = async () => {
            try {
                const MedicinesData = await getMedicinesByTotalQuantityOrdered();
                setMedicines(MedicinesData);
            } catch (err) {
                toError();
            }
        };
        fetchMedicinesByTotal();

        const getActiveUsers = async () => {
            try {
                const usersData = await getMostActiveUser();
                setUsersData(usersData);
            } catch (err) {
                toError();
            }
        };
        getActiveUsers();

    }, [username]);

    return (
        <div>
            <h1 className='heading'>Профиль пользователя</h1>
            <h2>Имя пользователя: {username}</h2>
            <div className='container'>
                {error ? (<p>{error}</p>) : (
                    <ul>
                        <h1>Наиболее популярные товары:</h1>
                        {Medicines.map(med => (
                            <li key={med.medicineid}>id: {med.medicineid}, {med.totalordered} раз(а) заказано</li>
                        ))}
                    </ul>
                )}
            </div>
            <div className='container'>
                {error ? (<p>{error}</p>) : (
                    <ul>
                        <h1>Наиболее активные пользователи:</h1>
                        {Users.map(user => (
                            <li key={user.username}>username: {user.username}, {user.totalordered} заказов(а)</li>
                        ))}
                    </ul>
                )}
            </div>
            <div class="navbar">
                <div class="thq-navbar-nav">
                    <span>© Здоровье в корзине</span>
                    <button className='back'
                        onClick={goToHome} >
                        Выйти
                    </button>
                </div>
            </div>
        </div>
    )
}
