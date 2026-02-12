import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import { getDemoCourseWithDetails } from '../data/demoData';

const CourseDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedModules, setExpandedModules] = useState({});
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await api.getCourse(id);
        setCourse(response.data.course);
        setUserProgress(response.data.userProgress || []);
        setIsDemo(false);

        // Expand first module by default
        if (response.data.course?.modules?.length > 0) {
          setExpandedModules({ [response.data.course.modules[0].id]: true });
        }
      } catch (err) {
        console.error('Error fetching course:', err);

        // Try to load demo course
        const demoCourse = getDemoCourseWithDetails(id);
        if (demoCourse) {
          setCourse(demoCourse);
          setIsDemo(true);
          // Expand first module by default
          if (demoCourse.modules?.length > 0) {
            setExpandedModules({ [demoCourse.modules[0].id]: true });
          }
        } else {
          setError('Course tidak ditemukan.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const getLessonProgress = (lessonId) => {
    return userProgress.find((p) => p.lesson_id === lessonId);
  };

  const getTotalLessons = () => {
    return (
      course?.modules?.reduce(
        (acc, module) => acc + (module.lessons?.length || 0),
        0,
      ) || 0
    );
  };

  const getCompletedLessons = () => {
    return userProgress.filter((p) => p.status === 'completed').length;
  };

  if (loading) {
    return (
      <div className='page-container py-12'>
        <div className='container-main'>
          <Loading size='lg' text='Memuat course...' />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className='page-container py-12'>
        <div className='container-main text-center'>
          <svg
            className='w-16 h-16 text-gray-300 mx-auto mb-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Course tidak ditemukan
          </h2>
          <p className='text-gray-500 mb-4'>{error}</p>
          <Link to='/courses' className='btn-primary'>
            Kembali ke Courses
          </Link>
        </div>
      </div>
    );
  }

  const progressPercentage =
    getTotalLessons() > 0
      ? Math.round((getCompletedLessons() / getTotalLessons()) * 100)
      : 0;

  return (
    <div className='page-container py-8'>
      <div className='container-main'>
        {/* Demo Mode Banner */}
        {isDemo && (
          <div className='mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700'>
            <div className='flex items-center'>
              <svg
                className='w-5 h-5 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <span>
                <strong>Mode Demo:</strong> Menampilkan data contoh dengan video
                YouTube. Login untuk melacak progress.
              </span>
            </div>
          </div>
        )}

        {/* Breadcrumb */}
        <nav className='flex items-center space-x-2 text-sm text-gray-500 mb-6'>
          <Link to='/courses' className='hover:text-primary-600'>
            Courses
          </Link>
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5l7 7-7 7'
            />
          </svg>
          <span className='text-gray-900'>{course.title}</span>
        </nav>

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2'>
            {/* Course Header */}
            <div className='card p-8 mb-6'>
              <span className='inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full mb-4'>
                {course.category}
              </span>
              <h1 className='text-3xl font-bold text-gray-900 mb-4'>
                {course.title}
              </h1>
              <p className='text-gray-600 text-lg mb-6'>{course.description}</p>

              {/* Progress Bar */}
              {isAuthenticated && (
                <div className='bg-gray-100 rounded-lg p-4'>
                  <div className='flex justify-between text-sm mb-2'>
                    <span className='text-gray-600'>Progress Anda</span>
                    <span className='font-medium text-gray-900'>
                      {progressPercentage}%
                    </span>
                  </div>
                  <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-primary-600 rounded-full transition-all duration-300'
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <p className='text-xs text-gray-500 mt-2'>
                    {getCompletedLessons()} dari {getTotalLessons()} lessons
                    selesai
                  </p>
                </div>
              )}
            </div>

            {/* Modules */}
            <div className='space-y-4'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                Materi Pembelajaran
              </h2>

              {course.modules?.length === 0 ? (
                <div className='card p-8 text-center'>
                  <p className='text-gray-500'>
                    Belum ada materi untuk course ini
                  </p>
                </div>
              ) : (
                course.modules?.map((module, moduleIndex) => (
                  <div key={module.id} className='card overflow-hidden'>
                    <button
                      onClick={() => toggleModule(module.id)}
                      className='w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors'
                    >
                      <div className='flex items-center space-x-4'>
                        <div className='w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-semibold'>
                          {moduleIndex + 1}
                        </div>
                        <div className='text-left'>
                          <h3 className='font-semibold text-gray-900'>
                            {module.title}
                          </h3>
                          <p className='text-sm text-gray-500'>
                            {module.lessons?.length || 0} lessons
                          </p>
                        </div>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${expandedModules[module.id] ? 'rotate-180' : ''}`}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M19 9l-7 7-7-7'
                        />
                      </svg>
                    </button>

                    {expandedModules[module.id] && (
                      <div className='border-t border-gray-100'>
                        {module.lessons?.length === 0 ? (
                          <p className='p-5 text-gray-500 text-sm'>
                            Belum ada lesson
                          </p>
                        ) : (
                          module.lessons?.map((lesson, lessonIndex) => {
                            const progress = getLessonProgress(lesson.id);
                            const isCompleted =
                              progress?.status === 'completed';
                            const isOngoing = progress?.status === 'ongoing';

                            return (
                              <Link
                                key={lesson.id}
                                to={
                                  isAuthenticated || isDemo
                                    ? `/lesson/${lesson.id}`
                                    : '/login'
                                }
                                className='flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0'
                              >
                                <div className='flex items-center space-x-4'>
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                      isCompleted
                                        ? 'bg-green-100 text-green-600'
                                        : isOngoing
                                          ? 'bg-blue-100 text-blue-600'
                                          : 'bg-gray-100 text-gray-400'
                                    }`}
                                  >
                                    {isCompleted ? (
                                      <svg
                                        className='w-4 h-4'
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
                                      <span className='text-sm font-medium'>
                                        {lessonIndex + 1}
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <p className='font-medium text-gray-900'>
                                      {lesson.title}
                                    </p>
                                    {progress?.score !== undefined && (
                                      <p className='text-xs text-gray-500'>
                                        Skor: {progress.score}%
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className='flex items-center space-x-3'>
                                  <svg
                                    className='w-5 h-5 text-gray-400'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
                                    />
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                                    />
                                  </svg>
                                  <svg
                                    className='w-5 h-5 text-gray-400'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M9 5l7 7-7 7'
                                    />
                                  </svg>
                                </div>
                              </Link>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <div className='card p-6 sticky top-24'>
              <h3 className='font-semibold text-gray-900 mb-4'>Info Course</h3>

              <div className='space-y-4'>
                <div className='flex items-center text-gray-600'>
                  <svg
                    className='w-5 h-5 mr-3 text-gray-400'
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
                  {course.modules?.length || 0} Modules
                </div>

                <div className='flex items-center text-gray-600'>
                  <svg
                    className='w-5 h-5 mr-3 text-gray-400'
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
                  {getTotalLessons()} Video Lessons
                </div>

                <div className='flex items-center text-gray-600'>
                  <svg
                    className='w-5 h-5 mr-3 text-gray-400'
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
                  Quiz di setiap lesson
                </div>
              </div>

              {/* CTA */}
              {!isAuthenticated && !isDemo ? (
                <Link to='/login' className='btn-primary w-full mt-6'>
                  Login untuk Mulai
                </Link>
              ) : course.modules?.length > 0 &&
                course.modules[0].lessons?.length > 0 ? (
                <Link
                  to={`/lesson/${course.modules[0].lessons[0].id}`}
                  className='btn-primary w-full mt-6'
                >
                  {getCompletedLessons() > 0
                    ? 'Lanjutkan Belajar'
                    : 'Mulai Belajar'}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
