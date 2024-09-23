import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Импорт глобальных стилей
import App from './App'; // Импорт основного компонента


// Рендеринг основного компонента App в корневой элемент
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);