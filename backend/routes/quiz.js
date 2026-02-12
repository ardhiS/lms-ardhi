import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  getSheetData,
  appendRow,
  updateRow,
  findByColumn,
  findRowIndexByColumn,
  filterByColumn,
  SHEETS,
} from '../services/googleSheets.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/quiz/submit
 * Submit quiz answers and calculate score
 */
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { lesson_id, answers } = req.body;

    if (!lesson_id) {
      return res.status(400).json({
        success: false,
        message: 'Lesson ID is required',
      });
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Answers array is required',
      });
    }

    // Verify lesson exists
    const lesson = await findByColumn(SHEETS.LESSONS, 'id', lesson_id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    // Get quiz questions for this lesson
    const allQuizzes = await getSheetData(SHEETS.QUIZZES);
    const quizzes = allQuizzes.filter((quiz) => quiz.lesson_id === lesson_id);

    if (quizzes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No quiz questions found for this lesson',
      });
    }

    // Calculate score
    let correctCount = 0;
    const results = [];

    for (const answer of answers) {
      const quiz = quizzes.find((q) => q.id === answer.quiz_id);
      if (quiz) {
        const isCorrect =
          quiz.correct_answer.toLowerCase() ===
          answer.selected_answer.toLowerCase();
        if (isCorrect) {
          correctCount++;
        }
        results.push({
          quiz_id: answer.quiz_id,
          question: quiz.question,
          selected_answer: answer.selected_answer,
          correct_answer: quiz.correct_answer,
          is_correct: isCorrect,
        });
      }
    }

    const score = Math.round((correctCount / quizzes.length) * 100);
    const status = score >= 70 ? 'completed' : 'ongoing';
    const updatedAt = new Date().toISOString();

    // Check if progress already exists
    const allProgress = await getSheetData(SHEETS.USER_PROGRESS);
    const existingProgress = allProgress.find(
      (p) => p.user_id === req.user.id && p.lesson_id === lesson_id,
    );

    if (existingProgress) {
      // Update existing progress
      const rowIndex = await findRowIndexByColumn(
        SHEETS.USER_PROGRESS,
        'id',
        existingProgress.id,
      );
      if (rowIndex > 0) {
        await updateRow(SHEETS.USER_PROGRESS, rowIndex, [
          existingProgress.id,
          req.user.id,
          lesson_id,
          score.toString(),
          status,
          updatedAt,
        ]);
      }
    } else {
      // Create new progress
      const progressId = uuidv4();
      await appendRow(SHEETS.USER_PROGRESS, [
        progressId,
        req.user.id,
        lesson_id,
        score.toString(),
        status,
        updatedAt,
      ]);
    }

    res.json({
      success: true,
      message:
        status === 'completed'
          ? 'Congratulations! You passed the quiz!'
          : 'Keep trying! You need 70% to pass.',
      data: {
        score,
        totalQuestions: quizzes.length,
        correctAnswers: correctCount,
        status,
        passed: status === 'completed',
        results,
      },
    });
  } catch (error) {
    console.error('Quiz submit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz',
    });
  }
});

/**
 * GET /api/quiz/lesson/:lessonId
 * Get quiz questions for a lesson (without answers)
 */
router.get('/lesson/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;

    // Verify lesson exists
    const lesson = await findByColumn(SHEETS.LESSONS, 'id', lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    // Get quiz questions
    const allQuizzes = await getSheetData(SHEETS.QUIZZES);
    const quizzes = allQuizzes
      .filter((quiz) => quiz.lesson_id === lessonId)
      .map((quiz) => ({
        id: quiz.id,
        question: quiz.question,
        options: {
          a: quiz.option_a,
          b: quiz.option_b,
          c: quiz.option_c,
          d: quiz.option_d,
        },
        // correct_answer is intentionally not included
      }));

    res.json({
      success: true,
      data: {
        lesson: {
          id: lesson.id,
          title: lesson.title,
        },
        quizzes,
        totalQuestions: quizzes.length,
      },
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz questions',
    });
  }
});

export default router;
