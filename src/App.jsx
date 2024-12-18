// App.jsx
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/OrderDetails';
import './App.css';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Riders from './pages/Riders';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true' ? true : false);


  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <Router>
      {isAuthenticated && <Header handleLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/orders" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/orders/:orderId" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/riders" element={<Riders />} />
          <Route path="/riders/:riderName" element={<Riders />} />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;