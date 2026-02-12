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

// Validation rules
const courseValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
];

/**
 * GET /api/courses
 * Get all courses with optional pagination
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;

    let courses = await getSheetData(SHEETS.COURSES);

    // Filter by category if provided
    if (category) {
      courses = courses.filter(
        (course) => course.category.toLowerCase() === category.toLowerCase(),
      );
    }

    // Calculate pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedCourses = courses.slice(startIndex, endIndex);

    // Get module count for each course
    const modules = await getSheetData(SHEETS.MODULES);
    const coursesWithModules = paginatedCourses.map((course) => ({
      ...course,
      moduleCount: modules.filter((m) => m.course_id === course.id).length,
    }));

    res.json({
      success: true,
      data: {
        courses: coursesWithModules,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(courses.length / parseInt(limit)),
          totalItems: courses.length,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
    });
  }
});

/**
 * GET /api/courses/categories
 * Get all unique categories
 */
router.get('/categories', async (req, res) => {
  try {
    const courses = await getSheetData(SHEETS.COURSES);
    const categories = [...new Set(courses.map((course) => course.category))];

    res.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
    });
  }
});

/**
 * GET /api/courses/:id
 * Get course with modules and lessons
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Get course
    const course = await findByColumn(SHEETS.COURSES, 'id', id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Get modules for this course
    const allModules = await getSheetData(SHEETS.MODULES);
    const modules = allModules
      .filter((module) => module.course_id === id)
      .sort((a, b) => parseInt(a.order) - parseInt(b.order));

    // Get lessons for each module
    const allLessons = await getSheetData(SHEETS.LESSONS);
    const modulesWithLessons = modules.map((module) => ({
      ...module,
      lessons: allLessons
        .filter((lesson) => lesson.module_id === module.id)
        .sort((a, b) => parseInt(a.order) - parseInt(b.order)),
    }));

    // Get user progress if authenticated
    let userProgress = [];
    if (req.user) {
      const allProgress = await getSheetData(SHEETS.USER_PROGRESS);
      userProgress = allProgress.filter((p) => p.user_id === req.user.id);
    }

    res.json({
      success: true,
      data: {
        course: {
          ...course,
          modules: modulesWithLessons,
        },
        userProgress,
      },
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course',
    });
  }
});

/**
 * POST /api/courses
 * Create a new course (instructor/admin only)
 */
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'instructor'),
  courseValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { title, description, category, thumbnail = '' } = req.body;
      const courseId = uuidv4();
      const createdAt = new Date().toISOString();

      await appendRow(SHEETS.COURSES, [
        courseId,
        title,
        description,
        category,
        thumbnail,
        req.user.id,
        createdAt,
      ]);

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: {
          course: {
            id: courseId,
            title,
            description,
            category,
            thumbnail,
            instructor_id: req.user.id,
            created_at: createdAt,
          },
        },
      });
    } catch (error) {
      console.error('Create course error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create course',
      });
    }
  },
);

/**
 * POST /api/courses/:id/modules
 * Add a module to a course
 */
router.post(
  '/:id/modules',
  authenticateToken,
  authorizeRoles('admin', 'instructor'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, order } = req.body;

      if (!title) {
        return res.status(400).json({
          success: false,
          message: 'Module title is required',
        });
      }

      // Verify course exists
      const course = await findByColumn(SHEETS.COURSES, 'id', id);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found',
        });
      }

      const moduleId = uuidv4();

      await appendRow(SHEETS.MODULES, [moduleId, id, title, order || 1]);

      res.status(201).json({
        success: true,
        message: 'Module added successfully',
        data: {
          module: {
            id: moduleId,
            course_id: id,
            title,
            order: order || 1,
          },
        },
      });
    } catch (error) {
      console.error('Add module error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add module',
      });
    }
  },
);

export default router;
