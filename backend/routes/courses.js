import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  getSheetData,
  insertRow,
  findByColumn,
  filterByColumn,
  TABLES,
} from '../services/supabase.js';
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
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit) - 1;

    // Build Supabase query for courses
    let query = req.app.locals.supabase
      .from(TABLES.COURSES)
      .select('*', { count: 'exact' });
    if (category) {
      query = query.eq('category', category);
    }
    query = query.range(startIndex, endIndex);

    const {
      data: courses,
      count: totalItems,
      error: courseError,
    } = await query;
    if (courseError) throw courseError;

    // Get moduleCount for each course using aggregate
    const courseIds = courses.map((c) => c.id);
    let moduleCounts = [];
    if (courseIds.length > 0) {
      const { data: moduleAgg, error: moduleAggError } =
        await req.app.locals.supabase
          .from(TABLES.MODULES)
          .select('course_id, count:id')
          .in('course_id', courseIds)
          .group('course_id');
      if (moduleAggError) throw moduleAggError;
      moduleCounts = moduleAgg.reduce((acc, cur) => {
        acc[cur.course_id] = cur.count;
        return acc;
      }, {});
    }

    const coursesWithModules = courses.map((course) => ({
      ...course,
      moduleCount: moduleCounts[course.id]
        ? Number(moduleCounts[course.id])
        : 0,
    }));

    res.json({
      success: true,
      data: {
        courses: coursesWithModules,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalItems / parseInt(limit)),
          totalItems,
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
    const courses = await getSheetData(TABLES.COURSES);
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
    const course = await findByColumn(TABLES.COURSES, 'id', id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Get modules for this course
    const allModules = await getSheetData(TABLES.MODULES);
    const modules = allModules
      .filter((module) => module.course_id === id)
      .sort((a, b) => parseInt(a.order_index) - parseInt(b.order_index));

    // Get lessons for each module
    const allLessons = await getSheetData(TABLES.LESSONS);
    const modulesWithLessons = modules.map((module) => ({
      ...module,
      lessons: allLessons
        .filter((lesson) => lesson.module_id === module.id)
        .sort((a, b) => parseInt(a.order_index) - parseInt(b.order_index)),
    }));

    // Get user progress if authenticated
    let userProgress = [];
    if (req.user) {
      const allProgress = await getSheetData(TABLES.USER_PROGRESS);
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

      const newCourse = await insertRow(TABLES.COURSES, {
        title,
        description,
        thumbnail,
        instructor_id: req.user.id,
      });

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: {
          course: newCourse,
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
      const course = await findByColumn(TABLES.COURSES, 'id', id);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found',
        });
      }

      const newModule = await insertRow(TABLES.MODULES, {
        course_id: id,
        title,
        order_index: order || 1,
      });

      res.status(201).json({
        success: true,
        message: 'Module added successfully',
        data: {
          module: newModule,
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
