import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import Quiz from '../components/Quiz';
import {
  getDemoLessonWithDetails,
  validateDemoQuizAnswers,
} from '../data/demoData';

const Lesson = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [navigation, setNavigation] = useState({
    prevLesson: null,
    nextLesson: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);

        // If authenticated, try to fetch from API
        if (isAuthenticated) {
          const response = await api.getLesson(id);
          setLesson(response.data.lesson);
          setQuizzes(response.data.quizzes || []);
          setUserProgress(response.data.userProgress);
          setNavigation(response.data.navigation);
          setIsDemo(false);
        } else {
          // Not authenticated - try demo data
          throw new Error('Not authenticated - use demo');
        }
      } catch (err) {
        console.error('Error fetching lesson:', err);

        // Try demo data
        const demoData = getDemoLessonWithDetails(id);
        if (demoData) {
          setLesson(demoData.lesson);
          setQuizzes(demoData.quizzes);
          setNavigation(demoData.navigation);
          setIsDemo(true);
        } else {
          setError('Lesson tidak ditemukan.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id, isAuthenticated]);

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleQuizComplete = (score, passed) => {
    setUserProgress({
      ...userProgress,
      score,
      status: passed ? 'completed' : 'ongoing',
    });
  };

  // Demo quiz handler
  const handleDemoQuizComplete = (answers) => {
    const result = validateDemoQuizAnswers(id, answers);
    setUserProgress({
      score: result.score,
      status: result.status,
    });
    return result;
  };

  if (loading) {
    return (
      <div className='page-container py-12'>
        <div className='container-main'>
          <Loading size='lg' text='Memuat lesson...' />
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className='page-container py-12'>
        <div className='container-main text-center'>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Lesson tidak ditemukan
          </h2>
          <p className='text-gray-500 mb-4'>{error}</p>
          <Link to='/courses' className='btn-primary'>
            Kembali ke Courses
          </Link>
        </div>
      </div>
    );
  }

  const youtubeId = extractYouTubeId(lesson.youtube_url);

  return (
    <div className='page-container py-6'>
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
                <strong>Mode Demo:</strong> Video pembelajaran dari YouTube.
                Login untuk menyimpan progress.
              </span>
            </div>
          </div>
        )}

        {/* Breadcrumb */}
        <nav className='flex items-center space-x-2 text-sm text-gray-500 mb-6 flex-wrap'>
          <Link to='/courses' className='hover:text-primary-600'>
            Courses
          </Link>
          <svg
            className='w-4 h-4 flex-shrink-0'
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
          {lesson.course && (
            <>
              <Link
                to={`/course/${lesson.course.id}`}
                className='hover:text-primary-600'
              >
                {lesson.course.title}
              </Link>
              <svg
                className='w-4 h-4 flex-shrink-0'
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
            </>
          )}
          <span className='text-gray-900'>{lesson.title}</span>
        </nav>

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2'>
            {/* Video Player */}
            <div className='card overflow-hidden mb-6'>
              {youtubeId ? (
                <div className='video-container'>
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                    title={lesson.title}
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    loading='lazy'
                  />
                </div>
              ) : (
                <div className='aspect-video bg-gray-100 flex items-center justify-center'>
                  <div className='text-center text-gray-500'>
                    <svg
                      className='w-16 h-16 mx-auto mb-2 opacity-50'
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
                    <p>Video tidak tersedia</p>
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Info */}
            <div className='card p-6 mb-6'>
              <h1 className='text-2xl font-bold text-gray-900 mb-4'>
                {lesson.title}
              </h1>
              {lesson.module && (
                <p className='text-gray-500 mb-4'>
                  <span className='font-medium'>Module:</span>{' '}
                  {lesson.module.title}
                </p>
              )}
              {lesson.summary && (
                <div className='prose prose-gray max-w-none'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                    Ringkasan
                  </h3>
                  <p className='text-gray-600 whitespace-pre-line'>
                    {lesson.summary}
                  </p>
                </div>
              )}
            </div>

            {/* Quiz Section */}
            {!showQuiz && quizzes.length > 0 && (
              <div className='card p-6 mb-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      Quiz
                    </h3>
                    <p className='text-gray-500 text-sm mt-1'>
                      {quizzes.length} pertanyaan • Minimal 70% untuk lulus
                    </p>
                    {userProgress && (
                      <p
                        className={`text-sm mt-2 font-medium ${
                          userProgress.status === 'completed'
                            ? 'text-green-600'
                            : 'text-orange-600'
                        }`}
                      >
                        {userProgress.status === 'completed'
                          ? `Selesai dengan skor ${userProgress.score}%`
                          : `Skor terakhir: ${userProgress.score}%`}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setShowQuiz(true)}
                    className='btn-primary'
                  >
                    {userProgress ? 'Ulangi Quiz' : 'Mulai Quiz'}
                  </button>
                </div>
              </div>
            )}

            {/* Quiz Component */}
            {showQuiz && (
              <Quiz
                lessonId={id}
                quizzes={quizzes}
                onComplete={handleQuizComplete}
                onClose={() => setShowQuiz(false)}
                isDemo={isDemo}
                onDemoSubmit={isDemo ? handleDemoQuizComplete : undefined}
              />
            )}

            {/* Navigation */}
            <div className='flex justify-between items-center mt-6'>
              {navigation.prevLesson ? (
                <Link
                  to={`/lesson/${navigation.prevLesson.id}`}
                  className='flex items-center text-gray-600 hover:text-primary-600 transition-colors'
                >
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
                      d='M15 19l-7-7 7-7'
                    />
                  </svg>
                  <div className='text-left'>
                    <p className='text-xs text-gray-400'>Sebelumnya</p>
                    <p className='font-medium'>{navigation.prevLesson.title}</p>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {navigation.nextLesson ? (
                <Link
                  to={`/lesson/${navigation.nextLesson.id}`}
                  className='flex items-center text-gray-600 hover:text-primary-600 transition-colors'
                >
                  <div className='text-right'>
                    <p className='text-xs text-gray-400'>Selanjutnya</p>
                    <p className='font-medium'>{navigation.nextLesson.title}</p>
                  </div>
                  <svg
                    className='w-5 h-5 ml-2'
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
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <div className='card p-6 sticky top-24'>
              <h3 className='font-semibold text-gray-900 mb-4'>Status</h3>

              <div className='space-y-4'>
                {/* Completion Status */}
                <div
                  className={`p-4 rounded-lg ${
                    userProgress?.status === 'completed'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className='flex items-center'>
                    {userProgress?.status === 'completed' ? (
                      <>
                        <svg
                          className='w-5 h-5 text-green-600 mr-2'
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
                        <span className='text-green-700 font-medium'>
                          Selesai
                        </span>
                      </>
                    ) : (
                      <>
                        <svg
                          className='w-5 h-5 text-gray-400 mr-2'
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
                        <span className='text-gray-600 font-medium'>
                          Dalam Progress
                        </span>
                      </>
                    )}
                  </div>
                  {userProgress?.score !== undefined && (
                    <p className='text-sm mt-2 text-gray-600'>
                      Skor Quiz:{' '}
                      <span className='font-semibold'>
                        {userProgress.score}%
                      </span>
                    </p>
                  )}
                </div>

                {/* Back to Course */}
                {lesson.course && (
                  <Link
                    to={`/course/${lesson.course.id}`}
                    className='btn-outline w-full'
                  >
                    Lihat Semua Materi
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
