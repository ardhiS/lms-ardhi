import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className='page-container'>
      {/* Hero Section */}
      <section className='relative overflow-hidden py-20 lg:py-32'>
        {/* Gradient Background */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50' />

        {/* Decorative Blobs */}
        <div className='absolute top-0 left-0 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse' />
        <div
          className='absolute top-0 right-0 w-72 h-72 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse'
          style={{ animationDelay: '1s' }}
        />
        <div
          className='absolute bottom-0 left-1/2 w-72 h-72 bg-accent-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse'
          style={{ animationDelay: '2s' }}
        />

        <div className='container-main relative'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            <div className='text-center lg:text-left'>
              <div className='inline-block px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow-sm mb-6'>
                <span className='text-sm font-medium'>
                  <span className='text-secondary-600'>✨ Platform</span>
                  <span className='text-gray-600'> Persiapan TKA Terbaik</span>
                </span>
              </div>

              <h1 className='text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6'>
                Raih Skor Tinggi TKA dengan{' '}
                <span className='text-gradient'>TKA Master</span>
              </h1>
              <p className='text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0'>
                Platform persiapan Tes Kemampuan Akademik (TKA) dengan video
                pembelajaran, latihan soal interaktif, dan tracking progress
                untuk membantu Anda lolos seleksi SMA/SMK impian.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
                {isAuthenticated ? (
                  <Link
                    to='/dashboard'
                    className='btn-primary text-lg px-8 py-3'
                  >
                    Ke Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to='/register'
                      className='btn-accent text-lg px-8 py-3'
                    >
                      🚀 Mulai Latihan Gratis
                    </Link>
                    <Link
                      to='/courses'
                      className='btn-outline text-lg px-8 py-3'
                    >
                      Lihat Materi TKA
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className='relative'>
              {/* Floating Cards */}
              <div
                className='absolute -top-4 -left-4 bg-gradient-to-br from-secondary-500 to-secondary-600 text-white p-4 rounded-xl shadow-xl z-10 animate-bounce'
                style={{ animationDuration: '3s' }}
              >
                <div className='flex items-center gap-2'>
                  <span className='text-2xl'>📚</span>
                  <span className='font-semibold'>5 Subtes TKA</span>
                </div>
              </div>

              <div
                className='absolute -bottom-4 -right-4 bg-gradient-to-br from-accent-500 to-accent-600 text-white p-4 rounded-xl shadow-xl z-10 animate-bounce'
                style={{ animationDuration: '3.5s' }}
              >
                <div className='flex items-center gap-2'>
                  <span className='text-2xl'>🎯</span>
                  <span className='font-semibold'>Latihan Soal</span>
                </div>
              </div>

              {/* Main Card */}
              <div className='bg-white rounded-2xl shadow-2xl p-2 transform hover:scale-105 transition-transform duration-300'>
                <div className='bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-xl p-1'>
                  <div className='bg-white rounded-lg p-6'>
                    <div className='video-container rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50'>
                      <div className='relative flex items-center justify-center min-h-[220px]'>
                        <iframe
                          width='360'
                          height='215'
                          src='https://www.youtube.com/embed/W6NZfCO5SIk'
                          title='Video Literasi Bahasa Indonesia'
                          frameBorder='0'
                          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                          allowFullScreen
                          className='rounded-lg shadow-lg mx-auto'
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-white relative overflow-hidden'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-5'>
          <div
            className='absolute top-0 left-0 w-full h-full'
            style={{
              backgroundImage:
                'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
        </div>

        <div className='container-main relative'>
          <div className='text-center mb-16'>
            <span className='inline-block px-4 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium mb-4'>
              Fitur Unggulan
            </span>
            <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-4'>
              Semua yang Anda Butuhkan untuk{' '}
              <span className='text-gradient-primary'>Lolos TKA</span>
            </h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Platform kami dirancang untuk mempersiapkan Anda menghadapi Tes
              Kemampuan Akademik dengan materi lengkap dan terstruktur
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {/* Feature 1 - Video */}
            <div className='group card p-8 text-center hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary-500'>
              <div className='w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform'>
                <svg
                  className='w-8 h-8 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Video Pembahasan
              </h3>
              <p className='text-gray-600'>
                Tonton video pembahasan soal TKA dari tutor berpengalaman dengan
                penjelasan detail
              </p>
            </div>

            {/* Feature 2 - Quiz */}
            <div className='group card p-8 text-center hover:shadow-xl transition-all duration-300 border-t-4 border-t-secondary-500'>
              <div className='w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-secondary-500/30 group-hover:scale-110 transition-transform'>
                <svg
                  className='w-8 h-8 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Latihan Soal TKA
              </h3>
              <p className='text-gray-600'>
                Uji kemampuan dengan latihan soal TKA dan lihat skor Anda secara
                real-time
              </p>
            </div>

            {/* Feature 3 - Progress */}
            <div className='group card p-8 text-center hover:shadow-xl transition-all duration-300 border-t-4 border-t-accent-500'>
              <div className='w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent-500/30 group-hover:scale-110 transition-transform'>
                <svg
                  className='w-8 h-8 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Progress Tracking
              </h3>
              <p className='text-gray-600'>
                Pantau kemajuan persiapan TKA Anda dengan dashboard yang
                informatif dan mudah dipahami
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-20 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-700 relative overflow-hidden'>
        {/* Decorative Elements */}
        <div className='absolute inset-0'>
          <div className='absolute top-0 left-0 w-full h-full opacity-10'>
            <div className='absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full' />
            <div className='absolute bottom-10 right-10 w-48 h-48 border-2 border-white rounded-full' />
            <div className='absolute top-1/2 left-1/3 w-24 h-24 border-2 border-white rounded-full' />
          </div>
        </div>

        <div className='container-main relative'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            <div className='group'>
              <div className='text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform'>
                5+
              </div>
              <div className='text-primary-100 font-medium'>Subtes TKA</div>
            </div>
            <div className='group'>
              <div className='text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform'>
                100+
              </div>
              <div className='text-primary-100 font-medium'>
                Video Pembahasan
              </div>
            </div>
            <div className='group'>
              <div className='text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform'>
                1000+
              </div>
              <div className='text-primary-100 font-medium'>Soal Latihan</div>
            </div>
            <div className='group'>
              <div className='text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform'>
                5000+
              </div>
              <div className='text-primary-100 font-medium'>Peserta</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='py-20 bg-gray-50'>
        <div className='container-main'>
          <div className='text-center mb-16'>
            <span className='inline-block px-4 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium mb-4'>
              Cara Kerja
            </span>
            <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-4'>
              Mulai Belajar dalam{' '}
              <span className='text-gradient-accent'>3 Langkah</span>
            </h2>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {/* Step 1 */}
            <div className='relative text-center'>
              <div className='w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white shadow-lg'>
                1
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Daftar Gratis
              </h3>
              <p className='text-gray-600'>
                Buat akun dalam hitungan detik dan mulai eksplorasi materi TKA
              </p>
              {/* Connector Line */}
              <div className='hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-300 to-secondary-300' />
            </div>

            {/* Step 2 */}
            <div className='relative text-center'>
              <div className='w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white shadow-lg'>
                2
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Pilih Subtes
              </h3>
              <p className='text-gray-600'>
                Temukan subtes TKA yang ingin Anda kuasai lebih dalam
              </p>
              <div className='hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-secondary-300 to-accent-300' />
            </div>

            {/* Step 3 */}
            <div className='text-center'>
              <div className='w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white shadow-lg'>
                3
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Mulai Latihan
              </h3>
              <p className='text-gray-600'>
                Tonton video, selesaikan latihan soal, dan pantau progress Anda
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-white relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50' />

        <div className='container-main text-center relative'>
          <div className='inline-block p-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-2xl mb-8'>
            <div className='bg-white px-6 py-3 rounded-xl'>
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 font-semibold'>
                🎉 Raih PTN impianmu hari ini!
              </span>
            </div>
          </div>

          <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-4'>
            Siap Untuk Taklukkan TKA?
          </h2>
          <p className='text-gray-600 max-w-xl mx-auto mb-8'>
            Daftar sekarang dan akses semua materi persiapan TKA secara gratis.
            Bergabung dengan ribuan peserta lainnya!
          </p>
          {!isAuthenticated && (
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link to='/register' className='btn-accent text-lg px-8 py-3'>
                🚀 Daftar Sekarang - Gratis!
              </Link>
              <Link to='/courses' className='btn-outline text-lg px-8 py-3'>
                Jelajahi Materi TKA
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Landing;
