import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Customers from './pages/Customers';
import Promotions from './pages/Promotions';
import PromoVehicles from './pages/PromoVehicles';
import Report from './pages/Report';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (user === undefined) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user === undefined) return null;
  return user ? <Navigate to="/dashboard" /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"          element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register"       element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/dashboard"      element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/vehicles"       element={<PrivateRoute><Vehicles /></PrivateRoute>} />
          <Route path="/customers"      element={<PrivateRoute><Customers /></PrivateRoute>} />
          <Route path="/promotions"     element={<PrivateRoute><Promotions /></PrivateRoute>} />
          <Route path="/promo-vehicles" element={<PrivateRoute><PromoVehicles /></PrivateRoute>} />
          <Route path="/report"         element={<PrivateRoute><Report /></PrivateRoute>} />
          <Route path="*"               element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
