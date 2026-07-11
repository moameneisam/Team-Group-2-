import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { ROUTES } from './utils/config';

import Landing from './pages/Landing';
import Roadmap from './pages/Roadmap';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Landing />} />
      <Route path={ROUTES.ROADMAP} element={<Roadmap />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

      <Route
        path={ROUTES.DASHBOARD}
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
      />
      <Route
        path={ROUTES.HISTORY}
        element={<ProtectedRoute><History /></ProtectedRoute>}
      />
      <Route
        path={ROUTES.SETTINGS}
        element={<ProtectedRoute><Settings /></ProtectedRoute>}
      />

      <Route path="/planner" element={<Navigate to={ROUTES.HOME} replace />} />
      <Route path="/projects" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}

export default App;
