import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Quiz Component with Vanilla JavaScript Logic
 * Features:
 * - Question looping
 * - Answer validation
 * - Score calculation
 * - Feedback display
 * - Result submission via fetch API
 * - Demo mode support (local validation)
 */
const Quiz = ({
  lessonId,
  quizzes,
  onComplete,
  onClose,
  isDemo = false,
  onDemoSubmit,
}) => {
  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Current question
  const currentQuestion = quizzes[currentQuestionIndex];
  const totalQuestions = quizzes.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const allQuestionsAnswered =
    Object.keys(selectedAnswers).length === totalQuestions;

  // =====================
  // VANILLA JS QUIZ LOGIC
  // =====================

  /**
   * Handle answer selection
   * Using vanilla JS logic for state manipulation
   */
  const handleSelectAnswer = (answer) => {
    if (submitted) return;

    // Vanilla JS: Create new object with spread operator
    const newAnswers = { ...selectedAnswers };
    newAnswers[currentQuestion.id] = answer;
    setSelectedAnswers(newAnswers);
  };

  /**
   * Navigate to next question
   */
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  /**
   * Navigate to previous question
   */
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  /**
   * Calculate score locally (vanilla JS)
   * This is just for preview - actual validation is done on backend
   */
  const calculateLocalProgress = () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    return Math.round((answeredCount / totalQuestions) * 100);
  };

  /**
   * Submit quiz answers to backend
   * Uses fetch API through our api service
   * In demo mode, uses local validation
   */
  const handleSubmitQuiz = async () => {
    if (!allQuestionsAnswered) {
      setError('Silakan jawab semua pertanyaan terlebih dahulu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare answers array for API
      const answersArray = Object.entries(selectedAnswers).map(
        ([quizId, answer]) => ({
          quiz_id: quizId,
          selected_answer: answer,
        }),
      );

      let responseData;

      if (isDemo && onDemoSubmit) {
        // Demo mode: use local validation
        responseData = onDemoSubmit(answersArray);
      } else {
        // Production mode: submit to backend via fetch API
        const response = await api.submitQuiz(lessonId, answersArray);
        responseData = response.data;
      }

      setResults(responseData);
      setSubmitted(true);

      // Notify parent component
      if (onComplete) {
        onComplete(responseData.score, responseData.passed);
      }
    } catch (err) {
      setError(err.message || 'Gagal submit quiz. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset quiz to try again
   */
  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setSubmitted(false);
    setResults(null);
    setError('');
  };

  // =====================
  // RENDER LOGIC
  // =====================

  // Show results after submission
  if (submitted && results) {
    return (
      <div className='card p-6 mb-6 animate-fade-in'>
        <div className='text-center mb-6'>
          {results.passed ? (
            <>
              <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-10 h-10 text-green-600'
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
              <h2 className='text-2xl font-bold text-green-600 mb-2'>
                Selamat! Anda Lulus!
              </h2>
            </>
          ) : (
            <>
              <div className='w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-10 h-10 text-orange-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
                </svg>
              </div>
              <h2 className='text-2xl font-bold text-orange-600 mb-2'>
                Coba Lagi!
              </h2>
            </>
          )}

          <p className='text-gray-600'>
            {results.passed
              ? 'Anda telah menyelesaikan quiz ini.'
              : 'Anda perlu skor minimal 70% untuk lulus.'}
          </p>
        </div>

        {/* Score Display */}
        <div className='bg-gray-50 rounded-xl p-6 mb-6'>
          <div className='grid grid-cols-3 gap-4 text-center'>
            <div>
              <p className='text-3xl font-bold text-gray-900'>
                {results.score}%
              </p>
              <p className='text-sm text-gray-500'>Skor</p>
            </div>
            <div>
              <p className='text-3xl font-bold text-green-600'>
                {results.correctAnswers}
              </p>
              <p className='text-sm text-gray-500'>Benar</p>
            </div>
            <div>
              <p className='text-3xl font-bold text-red-600'>
                {results.totalQuestions - results.correctAnswers}
              </p>
              <p className='text-sm text-gray-500'>Salah</p>
            </div>
          </div>
        </div>

        {/* Results Detail */}
        <div className='space-y-4 mb-6'>
          <h3 className='font-semibold text-gray-900'>Detail Jawaban</h3>
          {results.results.map((result, index) => (
            <div
              key={result.quiz_id}
              className={`p-4 rounded-lg border ${
                result.is_correct
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className='flex items-start'>
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3 ${
                    result.is_correct ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {result.is_correct ? '✓' : '✗'}
                </span>
                <div className='flex-1'>
                  <p className='font-medium text-gray-900 mb-2'>
                    {index + 1}. {result.question}
                  </p>
                  <p className='text-sm'>
                    <span className='text-gray-500'>Jawaban Anda: </span>
                    <span
                      className={
                        result.is_correct
                          ? 'text-green-600 font-medium'
                          : 'text-red-600 font-medium'
                      }
                    >
                      {result.selected_answer.toUpperCase()}
                    </span>
                  </p>
                  {!result.is_correct && (
                    <p className='text-sm'>
                      <span className='text-gray-500'>Jawaban Benar: </span>
                      <span className='text-green-600 font-medium'>
                        {result.correct_answer.toUpperCase()}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className='flex gap-4'>
          {!results.passed && (
            <button onClick={handleRetry} className='btn-primary flex-1'>
              Coba Lagi
            </button>
          )}
          <button onClick={onClose} className='btn-secondary flex-1'>
            {results.passed ? 'Selesai' : 'Tutup'}
          </button>
        </div>
      </div>
    );
  }

  // Quiz in progress
  return (
    <div className='card p-6 mb-6 animate-fade-in'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-bold text-gray-900'>Quiz</h2>
        <button onClick={onClose} className='text-gray-400 hover:text-gray-600'>
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className='mb-6'>
        <div className='flex justify-between text-sm text-gray-500 mb-2'>
          <span>
            Pertanyaan {currentQuestionIndex + 1} dari {totalQuestions}
          </span>
          <span>{calculateLocalProgress()}% selesai</span>
        </div>
        <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
          <div
            className='h-full bg-primary-600 rounded-full transition-all duration-300'
            style={{
              width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className='mb-6'>
        <p className='text-lg font-medium text-gray-900 mb-4'>
          {currentQuestionIndex + 1}. {currentQuestion?.question}
        </p>

        {/* Options */}
        <div className='space-y-3'>
          {['a', 'b', 'c', 'd'].map((option) => {
            const optionValue = currentQuestion?.options?.[option];
            const isSelected = selectedAnswers[currentQuestion?.id] === option;

            if (!optionValue) return null;

            return (
              <button
                key={option}
                onClick={() => handleSelectAnswer(option)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className='flex items-center'>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                      isSelected
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {option.toUpperCase()}
                  </span>
                  <span className='text-gray-700'>{optionValue}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
          {error}
        </div>
      )}

      {/* Navigation & Submit */}
      <div className='flex items-center justify-between'>
        <button
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          className='px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          ← Sebelumnya
        </button>

        <div className='flex gap-2'>
          {/* Question dots */}
          {quizzes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-primary-600'
                  : selectedAnswers[quizzes[index]?.id]
                    ? 'bg-green-500'
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {isLastQuestion ? (
          <button
            onClick={handleSubmitQuiz}
            disabled={loading || !allQuestionsAnswered}
            className='btn-primary'
          >
            {loading ? (
              <span className='flex items-center'>
                <svg
                  className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
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
                Mengirim...
              </span>
            ) : (
              'Submit Quiz'
            )}
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className='px-4 py-2 text-primary-600 hover:text-primary-700 font-medium'
          >
            Selanjutnya →
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
