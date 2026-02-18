import { useState, useEffect } from 'react';
import { X, BookOpen, Trophy, Clock, TrendingUp } from 'lucide-react';
import { getStudentDetail } from '../../services/StudentMonitoringService';
import QuizAnswerReview from './QuizAnswerReview';

const StudentDetailModal = ({ student, onClose }) => {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    useEffect(() => {
        fetchDetail();
    }, [student.id]);

    const fetchDetail = async () => {
        try {
            setLoading(true);
            const data = await getStudentDetail(student.id);
            setDetail(data);
        } catch (error) {
            console.error('Failed to fetch student detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const getProgressColor = (progress) => {
        if (progress >= 80) return 'bg-green-500';
        if (progress >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getScoreColor = (score) => {
        if (score >= 85) return 'text-green-600 dark:text-green-400';
        if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    if (selectedQuiz) {
        return (
            <QuizAnswerReview
                studentId={student.id}
                quizId={selectedQuiz}
                onBack={() => setSelectedQuiz(null)}
            />
        );
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
                    onClick={onClose}
                />

                {/* Modal panel */}
                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl">
                                    {student.avatar}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{student.name}</h3>
                                    <p className="text-primary-100">{student.email}</p>
                                    <p className="text-sm text-primary-200 mt-1">
                                        Bergabung: {student.joinedDate}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white hover:text-gray-200 transition"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                        {loading ? (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                Memuat detail siswa...
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Stats Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
                                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                    {student.progress}%
                                                </p>
                                            </div>
                                            <TrendingUp className="text-blue-600 dark:text-blue-400" size={32} />
                                        </div>
                                    </div>

                                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Rata-rata Skor</p>
                                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                    {student.avgScore.toFixed(1)}
                                                </p>
                                            </div>
                                            <Trophy className="text-green-600 dark:text-green-400" size={32} />
                                        </div>
                                    </div>

                                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Course Selesai</p>
                                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                    {student.completedCourses}/{student.totalCourses}
                                                </p>
                                            </div>
                                            <BookOpen className="text-purple-600 dark:text-purple-400" size={32} />
                                        </div>
                                    </div>

                                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Quiz</p>
                                                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                                    {detail?.quizHistory?.length || 0}
                                                </p>
                                            </div>
                                            <Clock className="text-orange-600 dark:text-orange-400" size={32} />
                                        </div>
                                    </div>
                                </div>

                                {/* Course Progress */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Progress Per Course
                                    </h4>
                                    <div className="space-y-3">
                                        {detail?.courseProgress?.map((course) => (
                                            <div key={course.courseId} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <h5 className="font-medium text-gray-900 dark:text-white">
                                                            {course.courseName}
                                                        </h5>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {course.completedLessons}/{course.totalLessons} lessons •
                                                            Rata-rata: <span className={getScoreColor(course.avgScore)}>{course.avgScore}</span>
                                                        </p>
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        {course.progress}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                    <div
                                                        className={`${getProgressColor(course.progress)} h-2 rounded-full transition-all`}
                                                        style={{ width: `${course.progress}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                    Terakhir diakses: {course.lastAccessed}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quiz History */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Riwayat Quiz
                                    </h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                        Lesson
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                        Course
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                        Skor
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                        Benar
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                        Waktu
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                        Aksi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {detail?.quizHistory?.map((quiz) => (
                                                    <tr key={quiz.quizId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                            {quiz.lessonName}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                                            {quiz.courseName}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`text-sm font-semibold ${getScoreColor(quiz.score)}`}>
                                                                {quiz.score}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                            {quiz.correctAnswers}/{quiz.totalQuestions}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                                            {quiz.completedAt}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <button
                                                                onClick={() => setSelectedQuiz(quiz.quizId)}
                                                                className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 text-sm font-medium"
                                                            >
                                                                Lihat Jawaban
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailModal;
