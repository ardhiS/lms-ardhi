import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className='bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50'>
      <div className='container-main'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link to='/' className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center shadow-md'>
              <svg
                className='w-5 h-5 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                />
              </svg>
            </div>
            <span className='text-xl font-bold text-gradient'>LMS Ardhi</span>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            <Link
              to='/courses'
              className='text-gray-600 hover:text-primary-600 transition-colors'
            >
              Courses
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to='/dashboard'
                  className='text-gray-600 hover:text-primary-600 transition-colors'
                >
                  Dashboard
                </Link>

                <div className='flex items-center space-x-4'>
                  <div className='flex items-center space-x-2'>
                    <div className='w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center'>
                      <span className='text-white font-medium text-sm'>
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className='text-sm text-gray-700 font-medium'>
                      {user?.name}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className='text-gray-500 hover:text-accent-600 transition-colors'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                      />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className='flex items-center space-x-4'>
                <Link
                  to='/login'
                  className='text-gray-600 hover:text-primary-600 transition-colors font-medium'
                >
                  Login
                </Link>
                <Link to='/register' className='btn-accent'>
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='md:hidden p-2 rounded-lg hover:bg-gray-100'
          >
            <svg
              className='w-6 h-6 text-gray-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              ) : (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className='md:hidden py-4 border-t border-gray-100'>
            <div className='flex flex-col space-y-4'>
              <Link
                to='/courses'
                className='text-gray-600 hover:text-primary-600 transition-colors'
                onClick={() => setMobileMenuOpen(false)}
              >
                Courses
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to='/dashboard'
                    className='text-gray-600 hover:text-primary-600 transition-colors'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className='text-left text-gray-600 hover:text-primary-600 transition-colors'
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to='/login'
                    className='text-gray-600 hover:text-primary-600 transition-colors'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to='/register'
                    className='btn-primary text-center'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
