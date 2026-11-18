import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import CourtDetail from './pages/CourtDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import MyReservations from './pages/MyReservations';
import NotFound from './pages/NotFound';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/canchas/:id" element={<CourtDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected user routes */}
              <Route
                path="/mis-reservas"
                element={
                  <ProtectedRoute>
                    <MyReservations />
                  </ProtectedRoute>
                }
              />

              {/* Fallback 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
