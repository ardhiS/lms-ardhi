import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

// Sheet names mapping
export const SHEETS = {
  USERS: 'Users',
  COURSES: 'Courses',
  MODULES: 'Modules',
  LESSONS: 'Lessons',
  QUIZZES: 'Quizzes',
  USER_PROGRESS: 'User_Progress',
};

// Initialize Google Sheets API
const getAuthClient = () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return auth;
};

const getSheetsClient = async () => {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
};

/**
 * Get all rows from a sheet
 * @param {string} sheetName - Name of the sheet
 * @returns {Promise<Array>} - Array of objects
 */
export const getSheetData = async (sheetName) => {
  try {
    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // First row is headers
    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    return data;
  } catch (error) {
    console.error(`Error fetching data from ${sheetName}:`, error);
    throw error;
  }
};

/**
 * Append a row to a sheet
 * @param {string} sheetName - Name of the sheet
 * @param {Array} values - Array of values to append
 * @returns {Promise<Object>} - Response from Google Sheets API
 */
export const appendRow = async (sheetName, values) => {
  try {
    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [values],
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error appending row to ${sheetName}:`, error);
    throw error;
  }
};

/**
 * Update a specific row in a sheet
 * @param {string} sheetName - Name of the sheet
 * @param {number} rowIndex - Row index (1-based, including header)
 * @param {Array} values - Array of values to update
 * @returns {Promise<Object>} - Response from Google Sheets API
 */
export const updateRow = async (sheetName, rowIndex, values) => {
  try {
    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${sheetName}!A${rowIndex}:Z${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values],
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error updating row ${rowIndex} in ${sheetName}:`, error);
    throw error;
  }
};

/**
 * Find a row by a specific column value
 * @param {string} sheetName - Name of the sheet
 * @param {string} columnName - Name of the column to search
 * @param {string} value - Value to search for
 * @returns {Promise<Object|null>} - Found row or null
 */
export const findByColumn = async (sheetName, columnName, value) => {
  try {
    const data = await getSheetData(sheetName);
    return data.find((row) => row[columnName] === value) || null;
  } catch (error) {
    console.error(`Error finding row in ${sheetName}:`, error);
    throw error;
  }
};

/**
 * Find row index by a specific column value
 * @param {string} sheetName - Name of the sheet
 * @param {string} columnName - Name of the column to search
 * @param {string} value - Value to search for
 * @returns {Promise<number>} - Row index (1-based) or -1 if not found
 */
export const findRowIndexByColumn = async (sheetName, columnName, value) => {
  try {
    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return -1;

    const headers = rows[0];
    const columnIndex = headers.indexOf(columnName);
    if (columnIndex === -1) return -1;

    for (let i = 1; i < rows.length; i++) {
      if (rows[i][columnIndex] === value) {
        return i + 1; // 1-based index
      }
    }

    return -1;
  } catch (error) {
    console.error(`Error finding row index in ${sheetName}:`, error);
    throw error;
  }
};

/**
 * Get filtered data by column value
 * @param {string} sheetName - Name of the sheet
 * @param {string} columnName - Name of the column to filter
 * @param {string} value - Value to filter by
 * @returns {Promise<Array>} - Array of matching rows
 */
export const filterByColumn = async (sheetName, columnName, value) => {
  try {
    const data = await getSheetData(sheetName);
    return data.filter((row) => row[columnName] === value);
  } catch (error) {
    console.error(`Error filtering data in ${sheetName}:`, error);
    throw error;
  }
};

/**
 * Initialize the spreadsheet with required headers
 * Call this once to set up the spreadsheet structure
 */
export const initializeSpreadsheet = async () => {
  const sheets = await getSheetsClient();

  const sheetConfigs = [
    {
      name: SHEETS.USERS,
      headers: ['id', 'name', 'email', 'password_hash', 'role', 'created_at'],
    },
    {
      name: SHEETS.COURSES,
      headers: [
        'id',
        'title',
        'description',
        'category',
        'thumbnail',
        'instructor_id',
        'created_at',
      ],
    },
    {
      name: SHEETS.MODULES,
      headers: ['id', 'course_id', 'title', 'order'],
    },
    {
      name: SHEETS.LESSONS,
      headers: ['id', 'module_id', 'title', 'youtube_url', 'summary', 'order'],
    },
    {
      name: SHEETS.QUIZZES,
      headers: [
        'id',
        'lesson_id',
        'question',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'correct_answer',
      ],
    },
    {
      name: SHEETS.USER_PROGRESS,
      headers: ['id', 'user_id', 'lesson_id', 'score', 'status', 'updated_at'],
    },
  ];

  console.log('Initializing spreadsheet...');
  console.log('Please ensure the following sheets exist in your spreadsheet:');
  sheetConfigs.forEach((config) => {
    console.log(`  - ${config.name}: ${config.headers.join(', ')}`);
  });
};

export default {
  getSheetData,
  appendRow,
  updateRow,
  findByColumn,
  findRowIndexByColumn,
  filterByColumn,
  initializeSpreadsheet,
  SHEETS,
};
