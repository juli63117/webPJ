import React from 'react';

export default function ErrorPage() {

    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div>
            <h1>Ошибка: Не удалось выполнить операцию</h1>
            <p>Произошла ошибка при выполнении операции. Пожалуйста, попробуйте еще раз позже.</p>

            <button onClick={handleGoBack}>Назад</button>
        </div>
    );
}
