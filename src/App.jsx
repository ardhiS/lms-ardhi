import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { lazy, Suspense } from 'react';

// Components (always loaded)
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ToastProvider from './components/ToastProvider';

// OPTIMIZATION: Lazy load pages for smaller initial bundle
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Lesson = lazy(() => import('./pages/Lesson'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const QuizResults = lazy(() => import('./pages/QuizResults'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat...</p>
    </div>
  </div>
);

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <Router>
          <ToastProvider />
          <Suspense fallback={<PageLoader />}>
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
                <Route
                  path='quiz/:lessonId'
                  element={
                    <ProtectedRoute>
                      <QuizPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='quiz-results/:lessonId'
                  element={
                    <ProtectedRoute>
                      <QuizResults />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* 404 Route */}
              <Route path='*' element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
