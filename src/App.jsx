import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Lesson from './pages/Lesson';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path='/' element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path='courses' element={<Courses />} />
            <Route path='course/:id' element={<CourseDetail />} />
          </Route>

          {/* Auth routes (no layout) */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          {/* Protected routes */}
          <Route path='/' element={<Layout />}>
            <Route
              path='dashboard'
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path='lesson/:id'
              element={
                <ProtectedRoute>
                  <Lesson />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
