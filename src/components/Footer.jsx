import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 mt-auto'>
      <div className='container-main py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Brand */}
          <div className='col-span-1 md:col-span-2'>
            <Link to='/' className='flex items-center space-x-2 mb-4'>
              <div className='w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center'>
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
              <span className='text-xl font-bold text-white'>LMS Ardhi</span>
            </Link>
            <p className='text-gray-400 text-sm max-w-md'>
              Platform pembelajaran modern (BAHASA INGGRIS & CODING) untuk
              meningkatkan skill dan pengetahuan Anda. Belajar kapan saja, di
              mana saja.
            </p>
            {/* Social Icons */}
            <div className='flex space-x-4 mt-4'>
              <a
                href='#'
                className='w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors'
              >
                <svg
                  className='w-5 h-5 text-gray-400 hover:text-white'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' />
                </svg>
              </a>
              <a
                href='#'
                className='w-10 h-10 bg-gray-800 hover:bg-secondary-600 rounded-full flex items-center justify-center transition-colors'
              >
                <svg
                  className='w-5 h-5 text-gray-400 hover:text-white'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                </svg>
              </a>
              <a
                href='#'
                className='w-10 h-10 bg-gray-800 hover:bg-accent-600 rounded-full flex items-center justify-center transition-colors'
              >
                <svg
                  className='w-5 h-5 text-gray-400 hover:text-white'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z' />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className='font-semibold text-white mb-4'>Platform</h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/courses'
                  className='text-gray-400 hover:text-primary-400 text-sm transition-colors'
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to='/dashboard'
                  className='text-gray-400 hover:text-primary-400 text-sm transition-colors'
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to='/register'
                  className='text-gray-400 hover:text-primary-400 text-sm transition-colors'
                >
                  Daftar
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className='font-semibold text-white mb-4'>Support</h4>
            <ul className='space-y-2'>
              <li>
                <a
                  href='#'
                  className='text-gray-400 hover:text-secondary-400 text-sm transition-colors'
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-400 hover:text-secondary-400 text-sm transition-colors'
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-400 hover:text-secondary-400 text-sm transition-colors'
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-gray-800 mt-8 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <p className='text-gray-500 text-sm'>
              © {new Date().getFullYear()} LMS Ardhi. All rights reserved.
            </p>
            <div className='flex items-center space-x-2 mt-4 md:mt-0'>
              <span className='text-gray-500 text-sm'>Made with</span>
              <span className='text-accent-500'>❤</span>
              <span className='text-gray-500 text-sm'>for learners</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
