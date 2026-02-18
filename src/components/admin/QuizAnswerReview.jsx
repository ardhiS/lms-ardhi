import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { getStudentQuizResults } from '../../services/StudentMonitoringService';

const QuizAnswerReview = ({ studentId, quizId, onBack }) => {
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuizResults();
    }, [studentId, quizId]);

    const fetchQuizResults = async () => {
        try {
            setLoading(true);
            const data = await getStudentQuizResults(studentId, quizId);
            setQuizData(data);
        } catch (error) {
            console.error('Failed to fetch quiz results:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75">
                <div className="text-white text-lg">Memuat hasil quiz...</div>
            </div>
        );
    }

    if (!quizData) {
        return null;
    }

    const getScoreColor = (score) => {
        if (score >= 85) return 'text-green-600 dark:text-green-400';
        if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" />

                {/* Modal panel */}
                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onBack}
                                className="text-white hover:text-gray-200 transition"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-white">Detail Jawaban Quiz</h3>
                                <p className="text-primary-100">{quizData.studentName}</p>
                                <p className="text-sm text-primary-200">
                                    {quizData.courseName} • {quizData.lessonName}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Score Summary */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Skor</p>
                                <p className={`text-2xl font-bold ${getScoreColor(quizData.score)}`}>
                                    {quizData.score}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Benar</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {quizData.correctAnswers}/{quizData.totalQuestions}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Waktu Selesai</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {quizData.completedAt}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Durasi</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {quizData.duration}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
                        <div className="space-y-6">
                            {quizData.questions.map((question, index) => (
                                <div
                                    key={question.questionId}
                                    className={`border-2 rounded-lg p-4 ${question.isCorrect
                                            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                                            : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                                        }`}
                                >
                                    {/* Question Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-start space-x-3 flex-1">
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${question.isCorrect
                                                    ? 'bg-green-500 dark:bg-green-600'
                                                    : 'bg-red-500 dark:bg-red-600'
                                                }`}>
                                                {question.isCorrect ? (
                                                    <CheckCircle className="text-white" size={20} />
                                                ) : (
                                                    <XCircle className="text-white" size={20} />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                    Soal {index + 1}
                                                </h4>
                                                <p className="text-gray-700 dark:text-gray-300 mt-1">
                                                    {question.question}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Options */}
                                    <div className="space-y-2 mb-3">
                                        {question.options.map((option, optIndex) => {
                                            const optionLetter = option.charAt(0);
                                            const isStudentAnswer = optionLetter === question.studentAnswer;
                                            const isCorrectAnswer = optionLetter === question.correctAnswer;

                                            let optionClass = 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600';

                                            if (isCorrectAnswer) {
                                                optionClass = 'bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-600';
                                            } else if (isStudentAnswer && !question.isCorrect) {
                                                optionClass = 'bg-red-100 dark:bg-red-900/30 border-red-500 dark:border-red-600';
                                            }

                                            return (
                                                <div
                                                    key={optIndex}
                                                    className={`border-2 rounded-lg p-3 ${optionClass}`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-900 dark:text-white">{option}</span>
                                                        <div className="flex items-center space-x-2">
                                                            {isStudentAnswer && (
                                                                <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                                                    Jawaban Siswa
                                                                </span>
                                                            )}
                                                            {isCorrectAnswer && (
                                                                <span className="text-xs font-medium px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                                                    Jawaban Benar
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Explanation */}
                                    {question.explanation && (
                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                            <div className="flex items-start space-x-2">
                                                <HelpCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={18} />
                                                <div>
                                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                                                        Penjelasan:
                                                    </p>
                                                    <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                                                        {question.explanation}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-between items-center">
                        <button
                            onClick={onBack}
                            className="flex items-center space-x-2 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
                        >
                            <ArrowLeft size={18} />
                            <span>Kembali</span>
                        </button>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {quizData.correctAnswers} dari {quizData.totalQuestions} soal benar
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizAnswerReview;
