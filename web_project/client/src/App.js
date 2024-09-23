import { React } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/pages/Header';
import Cart from './components/pages/Cart';
import Profile from './components/pages/Profile'
import ErrorPage from './components/pages/ErrorPage'
import Profile_admin from './components/pages/Profile_admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<><Header /></>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/profile_admin" element={<Profile_admin />} />
      </Routes>
    </Router>
  );
}

export default App;
