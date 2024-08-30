import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/register';
import LoginPage from './pages/login'; // Import your LoginPage components
// import ForgotPasswordPage from './ForgotPasswordPage'; // Import your ForgotPasswordPage component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        /* <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */ }
      </Routes>
    </Router>
  );
}

export default App;
