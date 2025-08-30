import './App.scss';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './container/auth/login';
import Signup from './container/auth/signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
