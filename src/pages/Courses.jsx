import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import { DEMO_COURSES, DEMO_CATEGORIES } from '../data/demoData';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.getCategories();
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Use demo categories if API fails
        setCategories(DEMO_CATEGORIES);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.getCourses(page, 9, selectedCategory);
        setCourses(response.data.courses || []);
        setPagination(response.data.pagination);
        setIsDemo(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        // Use demo courses if API fails
        let filteredCourses = DEMO_COURSES;
        if (selectedCategory) {
          filteredCourses = DEMO_COURSES.filter(
            (c) => c.category === selectedCategory,
          );
        }
        setCourses(filteredCourses);
        setPagination(null);
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [page, selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
  };

  // Get category-specific colors
  const getCategoryColors = (category) => {
    const colors = {
      Programming: {
        bg: 'from-primary-500 to-primary-600',
        badge: 'bg-primary-100 text-primary-700',
      },
      Backend: {
        bg: 'from-secondary-500 to-secondary-600',
        badge: 'bg-secondary-100 text-secondary-700',
      },
      Design: {
        bg: 'from-accent-500 to-accent-600',
        badge: 'bg-accent-100 text-accent-700',
      },
      Database: {
        bg: 'from-green-500 to-green-600',
        badge: 'bg-green-100 text-green-700',
      },
      Tools: {
        bg: 'from-indigo-500 to-indigo-600',
        badge: 'bg-indigo-100 text-indigo-700',
      },
    };
    return (
      colors[category] || {
        bg: 'from-gray-500 to-gray-600',
        badge: 'bg-gray-100 text-gray-700',
      }
    );
  };

  return (
    <div className='page-container py-8'>
      <div className='container-main'>
        {/* Demo Mode Banner */}
        {isDemo && (
          <div className='mb-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-xl'>
            <div className='flex items-center'>
              <div className='w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-3'>
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
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <div>
                <span className='font-semibold text-primary-700'>
                  Mode Demo
                </span>
                <p className='text-sm text-gray-600'>
                  Menampilkan data contoh. Klik course untuk melihat video dan
                  quiz.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className='mb-8'>
          <span className='inline-block px-4 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium mb-3'>
            📚 Katalog Pembelajaran
          </span>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Jelajahi <span className='text-gradient'>Courses</span>
          </h1>
          <p className='text-gray-600'>
            Pilih course yang ingin Anda pelajari dan mulai perjalanan belajar
            Anda
          </p>
        </div>

        {/* Filters */}
        <div className='mb-8 flex flex-wrap gap-2'>
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === ''
                ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ✨ Semua
          </button>
          {categories.map((category) => {
            const catColors = getCategoryColors(category);
            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? `bg-gradient-to-r ${catColors.bg} text-white shadow-md`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {error && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700'>
            {error}
          </div>
        )}

        {loading ? (
          <Loading size='lg' text='Memuat courses...' />
        ) : courses.length === 0 ? (
          <div className='text-center py-12'>
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
                d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
              />
            </svg>
            <h3 className='text-lg font-medium text-gray-900 mb-1'>
              Belum ada course
            </h3>
            <p className='text-gray-500'>Course akan segera tersedia</p>
          </div>
        ) : (
          <>
            {/* Course Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
              {courses.map((course) => {
                const colors = getCategoryColors(course.category);
                return (
                  <Link
                    key={course.id}
                    to={`/course/${course.id}`}
                    className='card-hover group'
                  >
                    <div
                      className={`h-44 bg-gradient-to-br ${colors.bg} flex items-center justify-center relative overflow-hidden`}
                    >
                      <svg
                        className='w-20 h-20 text-white/20 group-hover:scale-110 transition-transform'
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
                      <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent' />
                    </div>
                    <div className='p-5'>
                      <span
                        className={`inline-block px-2.5 py-1 ${colors.badge} text-xs font-medium rounded-full mb-3`}
                      >
                        {course.category}
                      </span>
                      <h3 className='font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors'>
                        {course.title}
                      </h3>
                      <p className='text-gray-500 text-sm line-clamp-2 mb-4'>
                        {course.description}
                      </p>
                      <div className='flex items-center justify-between text-sm'>
                        <div className='flex items-center text-gray-400'>
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
                        <span className='text-primary-600 font-medium group-hover:translate-x-1 transition-transform inline-block'>
                          Mulai →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className='flex justify-center gap-2'>
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className='px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Previous
                </button>

                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      page === i + 1
                        ? 'bg-primary-600 text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.totalPages}
                  className='px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;
