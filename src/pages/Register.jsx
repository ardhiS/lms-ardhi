import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    const result = await register(name, email, password, role);

    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Registrasi gagal. Silakan coba lagi.');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 py-12 px-4 relative overflow-hidden'>
      {/* Decorative Blobs */}
      <div className='absolute top-0 right-0 w-64 h-64 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20' />
      <div className='absolute bottom-0 left-0 w-64 h-64 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20' />
      <div className='absolute top-1/3 left-1/4 w-64 h-64 bg-accent-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20' />

      <div className='max-w-md w-full relative'>
        <div className='text-center mb-8'>
          <Link to='/' className='inline-flex items-center space-x-2 mb-6'>
            <div className='w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center shadow-lg'>
              <svg
                className='w-6 h-6 text-white'
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
            <span className='text-2xl font-bold text-gradient'>LMS Ardhi</span>
          </Link>
          <h1 className='text-3xl font-bold text-gray-900'>Buat Akun Baru</h1>
          <p className='text-gray-600 mt-2'>
            Daftar untuk mulai belajar sekarang
          </p>
        </div>

        <div className='card p-8 shadow-xl'>
          {error && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label htmlFor='name' className='label'>
                Nama Lengkap
              </label>
              <input
                type='text'
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='input'
                placeholder='John Doe'
                required
              />
            </div>

            <div>
              <label htmlFor='email' className='label'>
                Email
              </label>
              <input
                type='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='input'
                placeholder='nama@email.com'
                required
              />
            </div>

            <div>
              <label htmlFor='role' className='label'>
                Daftar Sebagai
              </label>
              <select
                id='role'
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className='input'
              >
                <option value='student'>Student</option>
                <option value='instructor'>Instructor</option>
              </select>
            </div>

            <div>
              <label htmlFor='password' className='label'>
                Password
              </label>
              <input
                type='password'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='input'
                placeholder='Minimal 6 karakter'
                required
              />
            </div>

            <div>
              <label htmlFor='confirmPassword' className='label'>
                Konfirmasi Password
              </label>
              <input
                type='password'
                id='confirmPassword'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='input'
                placeholder='Ulangi password'
                required
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='btn-primary w-full py-3'
            >
              {loading ? (
                <span className='flex items-center justify-center'>
                  <svg
                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                  </svg>
                  Memproses...
                </span>
              ) : (
                'Daftar'
              )}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-gray-600'>
              Sudah punya akun?{' '}
              <Link
                to='/login'
                className='text-primary-600 hover:text-primary-700 font-medium'
              >
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
