// Demo data for LMS (shown when backend is not available)
// This allows users to see the full functionality without setting up backend

export const DEMO_COURSES = [
  {
    id: 'demo-1',
    title: 'Belajar JavaScript dari Nol',
    description:
      'Pelajari dasar-dasar JavaScript untuk pemula. Mulai dari variabel, fungsi, hingga DOM manipulation. Course ini cocok untuk pemula yang ingin memulai karir sebagai web developer.',
    category: 'Programming',
    moduleCount: 2,
    thumbnail: '',
    instructor_id: 'instructor-1',
    created_at: '2024-01-15T00:00:00.000Z',
  },
  {
    id: 'demo-2',
    title: 'React.js untuk Pemula',
    description:
      'Bangun aplikasi web modern dengan React.js. Termasuk hooks, state management, dan routing. Anda akan belajar cara membuat komponen, mengelola state, dan membangun aplikasi full-stack.',
    category: 'Programming',
    moduleCount: 2,
    thumbnail: '',
    instructor_id: 'instructor-1',
    created_at: '2024-02-01T00:00:00.000Z',
  },
  {
    id: 'demo-3',
    title: 'Node.js & Express',
    description:
      'Pelajari backend development dengan Node.js dan Express.js. Buat REST API dari awal hingga deployment.',
    category: 'Backend',
    moduleCount: 2,
    thumbnail: '',
    instructor_id: 'instructor-2',
    created_at: '2024-02-15T00:00:00.000Z',
  },
  {
    id: 'demo-4',
    title: 'UI/UX Design Fundamentals',
    description:
      'Pelajari prinsip-prinsip design yang baik untuk membuat interface yang user-friendly dan menarik.',
    category: 'Design',
    moduleCount: 1,
    thumbnail: '',
    instructor_id: 'instructor-3',
    created_at: '2024-03-01T00:00:00.000Z',
  },
  {
    id: 'demo-5',
    title: 'Database dengan PostgreSQL',
    description:
      'Kuasai database relasional dengan PostgreSQL. Query, indexing, dan optimization untuk aplikasi skala besar.',
    category: 'Database',
    moduleCount: 1,
    thumbnail: '',
    instructor_id: 'instructor-2',
    created_at: '2024-03-15T00:00:00.000Z',
  },
  {
    id: 'demo-6',
    title: 'Git & GitHub Mastery',
    description:
      'Version control dengan Git dan kolaborasi dengan GitHub. Branching, merging, dan Pull Request workflow.',
    category: 'Tools',
    moduleCount: 1,
    thumbnail: '',
    instructor_id: 'instructor-1',
    created_at: '2024-04-01T00:00:00.000Z',
  },
];

export const DEMO_MODULES = [
  // JavaScript Course
  {
    id: 'mod-1',
    course_id: 'demo-1',
    title: 'Dasar-Dasar JavaScript',
    order: 1,
  },
  { id: 'mod-2', course_id: 'demo-1', title: 'JavaScript Lanjutan', order: 2 },

  // React Course
  { id: 'mod-3', course_id: 'demo-2', title: 'Pengenalan React', order: 1 },
  { id: 'mod-4', course_id: 'demo-2', title: 'React Hooks', order: 2 },

  // Node.js Course
  { id: 'mod-5', course_id: 'demo-3', title: 'Dasar Node.js', order: 1 },
  { id: 'mod-6', course_id: 'demo-3', title: 'Express.js Framework', order: 2 },

  // UI/UX Course
  { id: 'mod-7', course_id: 'demo-4', title: 'Prinsip UI/UX Design', order: 1 },

  // PostgreSQL Course
  {
    id: 'mod-8',
    course_id: 'demo-5',
    title: 'SQL & PostgreSQL Basics',
    order: 1,
  },

  // Git Course
  { id: 'mod-9', course_id: 'demo-6', title: 'Git Fundamentals', order: 1 },
];

export const DEMO_LESSONS = [
  // JavaScript Module 1 Lessons
  {
    id: 'lesson-1',
    module_id: 'mod-1',
    title: 'Apa itu JavaScript?',
    youtube_url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
    summary:
      'Pengenalan JavaScript sebagai bahasa pemrograman web. Sejarah JavaScript, mengapa JavaScript penting, dan bagaimana JavaScript bekerja di browser.',
    order: 1,
  },
  {
    id: 'lesson-2',
    module_id: 'mod-1',
    title: 'Variabel dan Tipe Data',
    youtube_url: 'https://www.youtube.com/watch?v=9emXNzqCKyg',
    summary:
      'Belajar tentang variabel (var, let, const), tipe data primitif (string, number, boolean, null, undefined), dan cara menggunakannya.',
    order: 2,
  },
  {
    id: 'lesson-3',
    module_id: 'mod-1',
    title: 'Operator dan Expressions',
    youtube_url: 'https://www.youtube.com/watch?v=FZzyij43A54',
    summary:
      'Operator aritmatika, perbandingan, logika, dan cara membuat expressions dalam JavaScript.',
    order: 3,
  },

  // JavaScript Module 2 Lessons
  {
    id: 'lesson-4',
    module_id: 'mod-2',
    title: 'Functions dalam JavaScript',
    youtube_url: 'https://www.youtube.com/watch?v=gigtS_5KOqo',
    summary:
      'Cara membuat dan menggunakan functions, parameter, return values, arrow functions, dan callback functions.',
    order: 1,
  },
  {
    id: 'lesson-5',
    module_id: 'mod-2',
    title: 'Array dan Object',
    youtube_url: 'https://www.youtube.com/watch?v=oigfaZ5ApsM',
    summary:
      'Bekerja dengan Array dan Object, array methods, destructuring, dan spread operator.',
    order: 2,
  },

  // React Module 1 Lessons
  {
    id: 'lesson-6',
    module_id: 'mod-3',
    title: 'Introduction to React',
    youtube_url: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM',
    summary:
      'Apa itu React, mengapa menggunakan React, Virtual DOM, dan cara setup project React dengan Vite.',
    order: 1,
  },
  {
    id: 'lesson-7',
    module_id: 'mod-3',
    title: 'JSX dan Components',
    youtube_url: 'https://www.youtube.com/watch?v=9YkUCxvaLEk',
    summary:
      'Memahami JSX syntax, membuat functional components, props, dan component composition.',
    order: 2,
  },

  // React Module 2 Lessons
  {
    id: 'lesson-8',
    module_id: 'mod-4',
    title: 'useState Hook',
    youtube_url: 'https://www.youtube.com/watch?v=O6P86uwfdR0',
    summary:
      'Mengelola state dalam functional components menggunakan useState hook.',
    order: 1,
  },
  {
    id: 'lesson-9',
    module_id: 'mod-4',
    title: 'useEffect Hook',
    youtube_url: 'https://www.youtube.com/watch?v=0ZJgIjIuY7U',
    summary:
      'Side effects dalam React, lifecycle dengan useEffect, cleanup functions, dan dependencies.',
    order: 2,
  },

  // Node.js Lessons
  {
    id: 'lesson-10',
    module_id: 'mod-5',
    title: 'Node.js Fundamentals',
    youtube_url: 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
    summary:
      'Pengenalan Node.js, cara kerja Node.js, modules, npm, dan membuat first Node.js app.',
    order: 1,
  },
  {
    id: 'lesson-11',
    module_id: 'mod-6',
    title: 'Building REST API with Express',
    youtube_url: 'https://www.youtube.com/watch?v=pKd0Rpw7O48',
    summary:
      'Membuat REST API dengan Express.js, routing, middleware, dan handling requests.',
    order: 1,
  },

  // UI/UX Lesson
  {
    id: 'lesson-12',
    module_id: 'mod-7',
    title: 'UI/UX Design Principles',
    youtube_url: 'https://www.youtube.com/watch?v=wIuVvCuiJhU',
    summary:
      'Prinsip dasar UI/UX design, user research, wireframing, dan prototyping.',
    order: 1,
  },

  // PostgreSQL Lesson
  {
    id: 'lesson-13',
    module_id: 'mod-8',
    title: 'PostgreSQL Tutorial',
    youtube_url: 'https://www.youtube.com/watch?v=qw--VYLpxG4',
    summary:
      'Pengenalan PostgreSQL, instalasi, basic SQL queries, dan database design.',
    order: 1,
  },

  // Git Lesson
  {
    id: 'lesson-14',
    module_id: 'mod-9',
    title: 'Git and GitHub for Beginners',
    youtube_url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
    summary:
      'Version control dengan Git, GitHub workflow, branching, merging, dan collaboration.',
    order: 1,
  },
];

export const DEMO_QUIZZES = [
  // JavaScript Lesson 1 Quiz
  {
    id: 'quiz-1',
    lesson_id: 'lesson-1',
    question: 'Apa ekstensi file untuk JavaScript?',
    option_a: '.java',
    option_b: '.js',
    option_c: '.javascript',
    option_d: '.jsx',
    correct_answer: 'b',
  },
  {
    id: 'quiz-2',
    lesson_id: 'lesson-1',
    question: 'JavaScript awalnya dikembangkan untuk platform apa?',
    option_a: 'Desktop',
    option_b: 'Mobile',
    option_c: 'Browser/Web',
    option_d: 'Server',
    correct_answer: 'c',
  },
  {
    id: 'quiz-3',
    lesson_id: 'lesson-1',
    question: 'Siapa yang menciptakan JavaScript?',
    option_a: 'James Gosling',
    option_b: 'Brendan Eich',
    option_c: 'Guido van Rossum',
    option_d: 'Dennis Ritchie',
    correct_answer: 'b',
  },

  // JavaScript Lesson 2 Quiz
  {
    id: 'quiz-4',
    lesson_id: 'lesson-2',
    question: 'Keyword mana yang membuat variabel yang tidak bisa di-reassign?',
    option_a: 'var',
    option_b: 'let',
    option_c: 'const',
    option_d: 'static',
    correct_answer: 'c',
  },
  {
    id: 'quiz-5',
    lesson_id: 'lesson-2',
    question: 'Apa tipe data dari nilai "Hello World"?',
    option_a: 'Number',
    option_b: 'String',
    option_c: 'Boolean',
    option_d: 'Object',
    correct_answer: 'b',
  },

  // React Lesson Quiz
  {
    id: 'quiz-6',
    lesson_id: 'lesson-6',
    question: 'React dikembangkan oleh perusahaan apa?',
    option_a: 'Google',
    option_b: 'Microsoft',
    option_c: 'Facebook/Meta',
    option_d: 'Amazon',
    correct_answer: 'c',
  },
  {
    id: 'quiz-7',
    lesson_id: 'lesson-6',
    question: 'Apa keuntungan utama menggunakan Virtual DOM?',
    option_a: 'Lebih banyak fitur',
    option_b: 'Performance lebih baik',
    option_c: 'Syntax lebih mudah',
    option_d: 'File size lebih kecil',
    correct_answer: 'b',
  },

  // useState Quiz
  {
    id: 'quiz-8',
    lesson_id: 'lesson-8',
    question: 'useState mengembalikan array dengan berapa elemen?',
    option_a: '1',
    option_b: '2',
    option_c: '3',
    option_d: '4',
    correct_answer: 'b',
  },
  {
    id: 'quiz-9',
    lesson_id: 'lesson-8',
    question: 'Bagaimana cara update state di React?',
    option_a: 'Langsung mengubah variabel state',
    option_b: 'Menggunakan setter function',
    option_c: 'Menggunakan this.state',
    option_d: 'Menggunakan document.getElementById',
    correct_answer: 'b',
  },
];

export const DEMO_CATEGORIES = [
  'Programming',
  'Backend',
  'Design',
  'Database',
  'Tools',
];

// Helper function to get course with modules and lessons
export const getDemoCourseWithDetails = (courseId) => {
  const course = DEMO_COURSES.find((c) => c.id === courseId);
  if (!course) return null;

  const modules = DEMO_MODULES.filter((m) => m.course_id === courseId)
    .sort((a, b) => a.order - b.order)
    .map((module) => ({
      ...module,
      lessons: DEMO_LESSONS.filter((l) => l.module_id === module.id).sort(
        (a, b) => a.order - b.order,
      ),
    }));

  return { ...course, modules };
};

// Helper function to get lesson with details
export const getDemoLessonWithDetails = (lessonId) => {
  const lesson = DEMO_LESSONS.find((l) => l.id === lessonId);
  if (!lesson) return null;

  const module = DEMO_MODULES.find((m) => m.id === lesson.module_id);
  const course = module
    ? DEMO_COURSES.find((c) => c.id === module.course_id)
    : null;

  // Get quizzes for this lesson
  const quizzes = DEMO_QUIZZES.filter((q) => q.lesson_id === lessonId).map(
    (q) => ({
      id: q.id,
      question: q.question,
      options: {
        a: q.option_a,
        b: q.option_b,
        c: q.option_c,
        d: q.option_d,
      },
    }),
  );

  // Get navigation (prev/next lessons)
  const moduleLessons = DEMO_LESSONS.filter(
    (l) => l.module_id === lesson.module_id,
  ).sort((a, b) => a.order - b.order);

  const currentIndex = moduleLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? moduleLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < moduleLessons.length - 1
      ? moduleLessons[currentIndex + 1]
      : null;

  return {
    lesson: {
      ...lesson,
      module: module ? { id: module.id, title: module.title } : null,
      course: course ? { id: course.id, title: course.title } : null,
    },
    quizzes,
    navigation: {
      prevLesson: prevLesson
        ? { id: prevLesson.id, title: prevLesson.title }
        : null,
      nextLesson: nextLesson
        ? { id: nextLesson.id, title: nextLesson.title }
        : null,
    },
  };
};

// Helper to validate quiz answers (for demo mode)
export const validateDemoQuizAnswers = (lessonId, answers) => {
  const quizzes = DEMO_QUIZZES.filter((q) => q.lesson_id === lessonId);

  let correctCount = 0;
  const results = answers
    .map((answer) => {
      const quiz = quizzes.find((q) => q.id === answer.quiz_id);
      if (!quiz) return null;

      const isCorrect =
        quiz.correct_answer.toLowerCase() ===
        answer.selected_answer.toLowerCase();
      if (isCorrect) correctCount++;

      return {
        quiz_id: answer.quiz_id,
        question: quiz.question,
        selected_answer: answer.selected_answer,
        correct_answer: quiz.correct_answer,
        is_correct: isCorrect,
      };
    })
    .filter(Boolean);

  const score = Math.round((correctCount / quizzes.length) * 100);

  return {
    score,
    totalQuestions: quizzes.length,
    correctAnswers: correctCount,
    status: score >= 70 ? 'completed' : 'ongoing',
    passed: score >= 70,
    results,
  };
};
