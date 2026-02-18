/**
 * StudentMonitoringService.js
 * Service for admin/teacher to monitor student progress
 * Currently uses mock data for demonstration
 */

// Mock student data
const MOCK_STUDENTS = [
    {
        id: 1,
        name: "Budi Santoso",
        email: "budi.santoso@example.com",
        avatar: "BS",
        progress: 85,
        avgScore: 87.5,
        completedCourses: 4,
        totalCourses: 5,
        lastActive: "2 jam lalu",
        status: "active",
        joinedDate: "2024-01-15"
    },
    {
        id: 2,
        name: "Siti Nurhaliza",
        email: "siti.nurhaliza@example.com",
        avatar: "SN",
        progress: 92,
        avgScore: 91.2,
        completedCourses: 5,
        totalCourses: 5,
        lastActive: "1 hari lalu",
        status: "active",
        joinedDate: "2024-01-10"
    },
    {
        id: 3,
        name: "Ahmad Rizki",
        email: "ahmad.rizki@example.com",
        avatar: "AR",
        progress: 45,
        avgScore: 72.3,
        completedCourses: 2,
        totalCourses: 5,
        lastActive: "3 hari lalu",
        status: "active",
        joinedDate: "2024-02-01"
    },
    {
        id: 4,
        name: "Dewi Lestari",
        email: "dewi.lestari@example.com",
        avatar: "DL",
        progress: 78,
        avgScore: 84.1,
        completedCourses: 3,
        totalCourses: 5,
        lastActive: "5 jam lalu",
        status: "active",
        joinedDate: "2024-01-20"
    },
    {
        id: 5,
        name: "Rudi Hartono",
        email: "rudi.hartono@example.com",
        avatar: "RH",
        progress: 30,
        avgScore: 68.5,
        completedCourses: 1,
        totalCourses: 5,
        lastActive: "1 minggu lalu",
        status: "inactive",
        joinedDate: "2024-01-25"
    },
    {
        id: 6,
        name: "Rina Wijaya",
        email: "rina.wijaya@example.com",
        avatar: "RW",
        progress: 95,
        avgScore: 93.8,
        completedCourses: 5,
        totalCourses: 5,
        lastActive: "30 menit lalu",
        status: "active",
        joinedDate: "2024-01-05"
    },
    {
        id: 7,
        name: "Andi Pratama",
        email: "andi.pratama@example.com",
        avatar: "AP",
        progress: 60,
        avgScore: 76.9,
        completedCourses: 3,
        totalCourses: 5,
        lastActive: "2 hari lalu",
        status: "active",
        joinedDate: "2024-01-18"
    },
    {
        id: 8,
        name: "Maya Kusuma",
        email: "maya.kusuma@example.com",
        avatar: "MK",
        progress: 88,
        avgScore: 89.4,
        completedCourses: 4,
        totalCourses: 5,
        lastActive: "4 jam lalu",
        status: "active",
        joinedDate: "2024-01-12"
    }
];

/**
 * Get all students with optional filtering
 * @param {Object} filters - { search, status, sortBy, sortOrder }
 * @returns {Promise<Array>} Array of students
 */
export const getAllStudents = async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    let students = [...MOCK_STUDENTS];

    // Apply search filter
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        students = students.filter(s =>
            s.name.toLowerCase().includes(searchLower) ||
            s.email.toLowerCase().includes(searchLower)
        );
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
        students = students.filter(s => s.status === filters.status);
    }

    // Apply sorting
    if (filters.sortBy) {
        students.sort((a, b) => {
            let aVal = a[filters.sortBy];
            let bVal = b[filters.sortBy];

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (filters.sortOrder === 'desc') {
                return aVal < bVal ? 1 : -1;
            }
            return aVal > bVal ? 1 : -1;
        });
    }

    return students;
};

/**
 * Get detailed student information
 * @param {number} studentId
 * @returns {Promise<Object>} Student detail with progress
 */
export const getStudentDetail = async (studentId) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const student = MOCK_STUDENTS.find(s => s.id === studentId);
    if (!student) throw new Error('Student not found');

    return {
        student,
        courseProgress: [
            {
                courseId: 1,
                courseName: "TKA Literasi",
                category: "Literasi",
                progress: 100,
                completedLessons: 10,
                totalLessons: 10,
                avgScore: 92,
                lastAccessed: "2024-02-15"
            },
            {
                courseId: 2,
                courseName: "TKA Numerasi",
                category: "Kuantitatif",
                progress: 80,
                completedLessons: 8,
                totalLessons: 10,
                avgScore: 85,
                lastAccessed: "2024-02-14"
            },
            {
                courseId: 3,
                courseName: "Penalaran Matematika",
                category: "Kuantitatif",
                progress: 70,
                completedLessons: 7,
                totalLessons: 10,
                avgScore: 78,
                lastAccessed: "2024-02-10"
            }
        ],
        quizHistory: [
            {
                quizId: 1,
                lessonId: 1,
                lessonName: "Pemahaman Bacaan",
                courseName: "TKA Literasi",
                score: 90,
                totalQuestions: 10,
                correctAnswers: 9,
                completedAt: "2024-02-15 14:30",
                duration: "15 menit"
            },
            {
                quizId: 2,
                lessonId: 2,
                lessonName: "Silogisme",
                courseName: "TKA Literasi",
                score: 80,
                totalQuestions: 10,
                correctAnswers: 8,
                completedAt: "2024-02-14 10:20",
                duration: "12 menit"
            },
            {
                quizId: 3,
                lessonId: 3,
                lessonName: "Aritmatika Dasar",
                courseName: "TKA Numerasi",
                score: 100,
                totalQuestions: 10,
                correctAnswers: 10,
                completedAt: "2024-02-13 16:45",
                duration: "18 menit"
            },
            {
                quizId: 4,
                lessonId: 4,
                lessonName: "Aljabar",
                courseName: "TKA Numerasi",
                score: 70,
                totalQuestions: 10,
                correctAnswers: 7,
                completedAt: "2024-02-12 11:15",
                duration: "20 menit"
            }
        ]
    };
};

/**
 * Get quiz results with detailed answers
 * @param {number} studentId
 * @param {number} quizId
 * @returns {Promise<Object>} Quiz with questions and answers
 */
export const getStudentQuizResults = async (studentId, quizId) => {
    await new Promise(resolve => setTimeout(resolve, 400));

    return {
        quizId,
        studentId,
        studentName: MOCK_STUDENTS.find(s => s.id === studentId)?.name || "Unknown",
        lessonName: "Pemahaman Bacaan",
        courseName: "TKA Literasi",
        score: 90,
        totalQuestions: 10,
        correctAnswers: 9,
        completedAt: "2024-02-15 14:30",
        duration: "15 menit",
        questions: [
            {
                questionId: 1,
                question: "Bacaan berikut membahas tentang apa?",
                options: [
                    "A. Perubahan iklim global",
                    "B. Teknologi pertanian modern",
                    "C. Dampak deforestasi",
                    "D. Konservasi hutan"
                ],
                studentAnswer: "D",
                correctAnswer: "D",
                isCorrect: true,
                explanation: "Bacaan fokus pada upaya konservasi hutan."
            },
            {
                questionId: 2,
                question: "Apa kesimpulan yang dapat ditarik dari paragraf kedua?",
                options: [
                    "A. Hutan sangat penting untuk kehidupan",
                    "B. Deforestasi harus dihentikan",
                    "C. Teknologi dapat membantu konservasi",
                    "D. Pemerintah harus bertindak"
                ],
                studentAnswer: "A",
                correctAnswer: "A",
                isCorrect: true,
                explanation: "Paragraf kedua menekankan pentingnya hutan."
            },
            {
                questionId: 3,
                question: "Silogisme berikut yang BENAR adalah...",
                options: [
                    "A. Semua A adalah B, Semua B adalah C, maka Semua A adalah C",
                    "B. Semua A adalah B, Beberapa B adalah C, maka Semua A adalah C",
                    "C. Beberapa A adalah B, Semua B adalah C, maka Semua A adalah C",
                    "D. Tidak ada yang benar"
                ],
                studentAnswer: "B",
                correctAnswer: "A",
                isCorrect: false,
                explanation: "Silogisme yang benar mengikuti aturan: Semua A adalah B, Semua B adalah C, maka Semua A adalah C."
            },
            {
                questionId: 4,
                question: "Manakah yang merupakan antonim dari kata 'optimis'?",
                options: [
                    "A. Pesimis",
                    "B. Realistis",
                    "C. Idealis",
                    "D. Materialis"
                ],
                studentAnswer: "A",
                correctAnswer: "A",
                isCorrect: true,
                explanation: "Antonim optimis adalah pesimis."
            },
            {
                questionId: 5,
                question: "Ide pokok paragraf pertama adalah...",
                options: [
                    "A. Pentingnya pendidikan",
                    "B. Masalah lingkungan",
                    "C. Teknologi modern",
                    "D. Kesehatan masyarakat"
                ],
                studentAnswer: "B",
                correctAnswer: "B",
                isCorrect: true,
                explanation: "Paragraf pertama membahas masalah lingkungan."
            }
        ]
    };
};

/**
 * Export students data to Excel
 * @param {Array} students - Array of student objects
 */
export const exportStudentsToExcel = async (students) => {
    // Import ExportService dynamically to avoid circular dependency
    const { exportToExcel } = await import('./ExportService');

    const data = students.map(s => ({
        'Nama': s.name,
        'Email': s.email,
        'Progress (%)': s.progress,
        'Rata-rata Skor': s.avgScore,
        'Course Selesai': `${s.completedCourses}/${s.totalCourses}`,
        'Status': s.status === 'active' ? 'Aktif' : 'Tidak Aktif',
        'Terakhir Aktif': s.lastActive,
        'Tanggal Bergabung': s.joinedDate
    }));

    exportToExcel(data, 'Data_Siswa');
};
