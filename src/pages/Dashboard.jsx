import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import { DEMO_COURSES } from '../data/demoData';

const Dashboard = () => {
  const { user, isDemo } = useAuth();
  const [progress, setProgress] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Demo mode: use local data
        if (isDemo) {
          setProgress({
            statistics: {
              completedLessons: 0,
              ongoingLessons: 0,
              averageScore: 0,
              totalProgress: 0,
            },
          });
          setCourses(DEMO_COURSES.slice(0, 6));
          setLoading(false);
          return;
        }

        // Fetch user progress and courses in parallel
        const [progressRes, coursesRes] = await Promise.all([
          api.getProgress(user.id),
          api.getCourses(1, 6),
        ]);

        setProgress(progressRes.data);
        setCourses(coursesRes.data.courses);
      } catch (err) {
        // Fallback to demo data if API fails
        setProgress({
          statistics: {
            completedLessons: 0,
            ongoingLessons: 0,
            averageScore: 0,
            totalProgress: 0,
          },
        });
        setCourses(DEMO_COURSES.slice(0, 6));
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user, isDemo]);

  if (loading) {
    return (
      <div className='page-container py-12'>
        <div className='container-main'>
          <Loading size='lg' text='Memuat dashboard...' />
        </div>
      </div>
    );
  }

  return (
    <div className='page-container py-8'>
      <div className='container-main'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Selamat datang, {user?.name}! 👋
          </h1>
          <p className='text-gray-600 mt-1'>
            Lanjutkan perjalanan belajar Anda
          </p>
        </div>

        {error && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700'>
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <div className='card p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Lessons Selesai</p>
                <p className='text-3xl font-bold text-gray-900'>
                  {progress?.statistics?.completedLessons || 0}
                </p>
              </div>
              <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
                <svg
                  className='w-6 h-6 text-green-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className='card p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Sedang Berlangsung</p>
                <p className='text-3xl font-bold text-gray-900'>
                  {progress?.statistics?.inProgressCount || 0}
                </p>
              </div>
              <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                <svg
                  className='w-6 h-6 text-blue-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className='card p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Rata-rata Skor</p>
                <p className='text-3xl font-bold text-gray-900'>
                  {progress?.statistics?.averageScore || 0}%
                </p>
              </div>
              <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center'>
                <svg
                  className='w-6 h-6 text-purple-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className='card p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Progress</p>
                <p className='text-3xl font-bold text-gray-900'>
                  {progress?.statistics?.completionPercentage || 0}%
                </p>
              </div>
              <div className='w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center'>
                <svg
                  className='w-6 h-6 text-orange-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Progress */}
        {progress?.progress && progress.progress.length > 0 && (
          <div className='mb-8'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold text-gray-900'>
                Progress Terbaru
              </h2>
            </div>
            <div className='card divide-y divide-gray-100'>
              {progress.progress.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className='p-4 flex items-center justify-between hover:bg-gray-50 transition-colors'
                >
                  <div className='flex items-center space-x-4'>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.status === 'completed'
                          ? 'bg-green-100'
                          : 'bg-blue-100'
                      }`}
                    >
                      {item.status === 'completed' ? (
                        <svg
                          className='w-5 h-5 text-green-600'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M5 13l4 4L19 7'
                          />
                        </svg>
                      ) : (
                        <svg
                          className='w-5 h-5 text-blue-600'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className='font-medium text-gray-900'>
                        {item.lesson?.title || 'Lesson'}
                      </p>
                      <p className='text-sm text-gray-500'>
                        {item.course?.title}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p
                      className={`font-semibold ${item.score >= 70 ? 'text-green-600' : 'text-orange-600'}`}
                    >
                      {item.score}%
                    </p>
                    <p className='text-xs text-gray-400'>
                      {new Date(item.updated_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Courses */}
        <div>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold text-gray-900'>Courses</h2>
            <Link
              to='/courses'
              className='text-primary-600 hover:text-primary-700 text-sm font-medium'
            >
              Lihat Semua →
            </Link>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/course/${course.id}`}
                className='card-hover'
              >
                <div className='h-40 bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center'>
                  <svg
                    className='w-16 h-16 text-white/30'
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
                <div className='p-5'>
                  <span className='inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded mb-2'>
                    {course.category}
                  </span>
                  <h3 className='font-semibold text-gray-900 mb-2 line-clamp-2'>
                    {course.title}
                  </h3>
                  <p className='text-gray-500 text-sm line-clamp-2'>
                    {course.description}
                  </p>
                  <div className='mt-4 flex items-center text-sm text-gray-400'>
                    <svg
                      className='w-4 h-4 mr-1'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                      />
                    </svg>
                    {course.moduleCount || 0} Modules
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
