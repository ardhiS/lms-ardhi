import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';
import {
  getSheetData,
  appendRow,
  findByColumn,
  filterByColumn,
  SHEETS,
} from '../services/googleSheets.js';
import {
  authenticateToken,
  authorizeRoles,
  optionalAuth,
} from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/lessons/:id
 * Get a specific lesson with quiz questions
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Get lesson
    const lesson = await findByColumn(SHEETS.LESSONS, 'id', id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    // Get quiz questions for this lesson
    const allQuizzes = await getSheetData(SHEETS.QUIZZES);
    const quizzes = allQuizzes
      .filter((quiz) => quiz.lesson_id === id)
      .map((quiz) => ({
        id: quiz.id,
        question: quiz.question,
        options: {
          a: quiz.option_a,
          b: quiz.option_b,
          c: quiz.option_c,
          d: quiz.option_d,
        },
        // Note: correct_answer is NOT sent to frontend
      }));

    // Get user progress if authenticated
    let userProgress = null;
    if (req.user) {
      const allProgress = await getSheetData(SHEETS.USER_PROGRESS);
      userProgress =
        allProgress.find(
          (p) => p.user_id === req.user.id && p.lesson_id === id,
        ) || null;
    }

    // Get module info
    const module = await findByColumn(SHEETS.MODULES, 'id', lesson.module_id);

    // Get course info
    let course = null;
    if (module) {
      course = await findByColumn(SHEETS.COURSES, 'id', module.course_id);
    }

    // Get next and previous lessons
    let prevLesson = null;
    let nextLesson = null;

    if (module) {
      const allLessons = await getSheetData(SHEETS.LESSONS);
      const moduleLessons = allLessons
        .filter((l) => l.module_id === lesson.module_id)
        .sort((a, b) => parseInt(a.order) - parseInt(b.order));

      const currentIndex = moduleLessons.findIndex((l) => l.id === id);

      if (currentIndex > 0) {
        prevLesson = {
          id: moduleLessons[currentIndex - 1].id,
          title: moduleLessons[currentIndex - 1].title,
        };
      }

      if (currentIndex < moduleLessons.length - 1) {
        nextLesson = {
          id: moduleLessons[currentIndex + 1].id,
          title: moduleLessons[currentIndex + 1].title,
        };
      }
    }

    res.json({
      success: true,
      data: {
        lesson: {
          ...lesson,
          module: module ? { id: module.id, title: module.title } : null,
          course: course ? { id: course.id, title: course.title } : null,
        },
        quizzes,
        userProgress,
        navigation: {
          prevLesson,
          nextLesson,
        },
      },
    });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lesson',
    });
  }
});

/**
 * POST /api/lessons
 * Create a new lesson (instructor/admin only)
 */
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'instructor'),
  async (req, res) => {
    try {
      const {
        module_id,
        title,
        youtube_url,
        summary = '',
        order = 1,
      } = req.body;

      if (!module_id || !title || !youtube_url) {
        return res.status(400).json({
          success: false,
          message: 'Module ID, title, and YouTube URL are required',
        });
      }

      // Verify module exists
      const module = await findByColumn(SHEETS.MODULES, 'id', module_id);
      if (!module) {
        return res.status(404).json({
          success: false,
          message: 'Module not found',
        });
      }

      const lessonId = uuidv4();

      await appendRow(SHEETS.LESSONS, [
        lessonId,
        module_id,
        title,
        youtube_url,
        summary,
        order,
      ]);

      res.status(201).json({
        success: true,
        message: 'Lesson created successfully',
        data: {
          lesson: {
            id: lessonId,
            module_id,
            title,
            youtube_url,
            summary,
            order,
          },
        },
      });
    } catch (error) {
      console.error('Create lesson error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create lesson',
      });
    }
  },
);

/**
 * POST /api/lessons/:id/quizzes
 * Add quiz questions to a lesson
 */
router.post(
  '/:id/quizzes',
  authenticateToken,
  authorizeRoles('admin', 'instructor'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { questions } = req.body;

      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Questions array is required',
        });
      }

      // Verify lesson exists
      const lesson = await findByColumn(SHEETS.LESSONS, 'id', id);
      if (!lesson) {
        return res.status(404).json({
          success: false,
          message: 'Lesson not found',
        });
      }

      const createdQuizzes = [];

      for (const q of questions) {
        if (
          !q.question ||
          !q.option_a ||
          !q.option_b ||
          !q.option_c ||
          !q.option_d ||
          !q.correct_answer
        ) {
          continue; // Skip invalid questions
        }

        const quizId = uuidv4();

        await appendRow(SHEETS.QUIZZES, [
          quizId,
          id,
          q.question,
          q.option_a,
          q.option_b,
          q.option_c,
          q.option_d,
          q.correct_answer.toLowerCase(),
        ]);

        createdQuizzes.push({
          id: quizId,
          lesson_id: id,
          question: q.question,
        });
      }

      res.status(201).json({
        success: true,
        message: `${createdQuizzes.length} quiz questions added successfully`,
        data: { quizzes: createdQuizzes },
      });
    } catch (error) {
      console.error('Add quizzes error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add quiz questions',
      });
    }
  },
);

export default router;
