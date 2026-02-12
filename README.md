# 🎓 LMS Ardhi - Modern Learning Management System

Platform pembelajaran modern (BAHASA INGGRIS & CODING) dengan video YouTube embed, quiz interaktif, dan progress tracking menggunakan Google Spreadsheet sebagai database.

## 📋 Table of Contents

- [Arsitektur Sistem](#-arsitektur-sistem)
- [Tech Stack](#-tech-stack)
- [Struktur Folder](#-struktur-folder)
- [Struktur Google Spreadsheet](#-struktur-google-spreadsheet)
- [Setup Google Service Account](#-setup-google-service-account)
- [Instalasi & Development](#-instalasi--development)
- [API Endpoints](#-api-endpoints)
- [Deployment Guide](#-deployment-guide)
- [Future Upgrades](#-future-upgrades)

---

## 🏗 Arsitektur Sistem

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   React.js      │────▶│   Express.js    │────▶│ Google Sheets   │
│   (Frontend)    │     │   (Backend)     │     │ (Database)      │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │                       │
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│   Vercel        │     │   Railway       │
│   (Hosting)     │     │   (Hosting)     │
└─────────────────┘     └─────────────────┘
```

### Flow Diagram

1. **User Flow:**
   - Landing Page → Register/Login → Dashboard → Pilih Course → Tonton Lesson → Kerjakan Quiz → Progress tersimpan

2. **Auth Flow:**
   - Register → Password di-hash (bcrypt) → Data ke Google Sheets
   - Login → Validasi → Generate JWT → Token untuk akses protected routes

3. **Quiz Flow:**
   - Ambil pertanyaan (tanpa jawaban) → User menjawab → Submit ke backend → Backend validasi & hitung skor → Simpan ke Google Sheets

---

## 🛠 Tech Stack

### Frontend

- **React.js 19** - UI Library (Functional Components + Hooks)
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing

### Backend

- **Node.js** - Runtime
- **Express.js** - API Framework
- **Google Sheets API** - Database
- **JWT** - Authentication
- **bcrypt** - Password Hashing

---

## 📁 Struktur Folder

```
LMS_ARDHI/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   ├── courses.js           # Courses endpoints
│   │   ├── lessons.js           # Lessons endpoints
│   │   ├── quiz.js              # Quiz endpoints
│   │   └── progress.js          # Progress endpoints
│   ├── services/
│   │   └── googleSheets.js      # Google Sheets integration
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── src/
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── Loading.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Quiz.jsx             # Quiz with vanilla JS logic
│   ├── context/
│   │   └── AuthContext.jsx      # Auth state management
│   ├── pages/
│   │   ├── CourseDetail.jsx
│   │   ├── Courses.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Landing.jsx
│   │   ├── Lesson.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── services/
│   │   └── api.js               # API service
│   ├── App.jsx
│   ├── index.css                # Tailwind styles
│   └── main.jsx
│
├── .env.example
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 📊 Struktur Google Spreadsheet

Gunakan 1 Google Spreadsheet dengan 6 sheet:

### Sheet 1: Users

| id   | name   | email  | password_hash | role                     | created_at |
| ---- | ------ | ------ | ------------- | ------------------------ | ---------- |
| uuid | string | string | hash          | admin/instructor/student | ISO date   |

### Sheet 2: Courses

| id   | title  | description | category | thumbnail | instructor_id | created_at |
| ---- | ------ | ----------- | -------- | --------- | ------------- | ---------- |
| uuid | string | string      | string   | url       | uuid          | ISO date   |

### Sheet 3: Modules

| id   | course_id | title  | order  |
| ---- | --------- | ------ | ------ |
| uuid | uuid      | string | number |

### Sheet 4: Lessons

| id   | module_id | title  | youtube_url | summary | order  |
| ---- | --------- | ------ | ----------- | ------- | ------ |
| uuid | uuid      | string | url         | string  | number |

### Sheet 5: Quizzes

| id   | lesson_id | question | option_a | option_b | option_c | option_d | correct_answer |
| ---- | --------- | -------- | -------- | -------- | -------- | -------- | -------------- |
| uuid | uuid      | string   | string   | string   | string   | string   | a/b/c/d        |

### Sheet 6: User_Progress

| id   | user_id | lesson_id | score  | status            | updated_at |
| ---- | ------- | --------- | ------ | ----------------- | ---------- |
| uuid | uuid    | uuid      | number | completed/ongoing | ISO date   |

---

## 🔐 Setup Google Service Account

### Langkah 1: Buat Project di Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Klik "Create Project" atau pilih project yang ada
3. Beri nama project (contoh: "LMS-Ardhi")
4. Klik "Create"

### Langkah 2: Enable Google Sheets API

1. Di sidebar, pilih "APIs & Services" > "Library"
2. Cari "Google Sheets API"
3. Klik dan tekan "Enable"

### Langkah 3: Buat Service Account

1. Di sidebar, pilih "APIs & Services" > "Credentials"
2. Klik "Create Credentials" > "Service Account"
3. Isi detail:
   - Name: `lms-service-account`
   - ID: (otomatis terisi)
4. Klik "Create and Continue"
5. Skip role (langsung "Continue")
6. Klik "Done"

### Langkah 4: Generate Private Key

1. Klik service account yang baru dibuat
2. Tab "Keys" > "Add Key" > "Create new key"
3. Pilih "JSON"
4. Klik "Create" (file JSON akan terdownload)
5. Simpan file ini dengan aman!

### Langkah 5: Setup Google Spreadsheet

1. Buat Google Spreadsheet baru
2. Buat 6 sheet dengan nama:
   - Users
   - Courses
   - Modules
   - Lessons
   - Quizzes
   - User_Progress
3. Tambahkan header di baris pertama sesuai struktur di atas
4. Copy Spreadsheet ID dari URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```
5. Share spreadsheet ke email service account:
   - Klik "Share"
   - Paste email dari service account (ada di JSON file)
   - Pilih "Editor"
   - Klik "Send"

### Langkah 6: Setup Environment Variables

Buat file `.env` di folder `backend/`:

```env
PORT=5000
NODE_ENV=development

JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d

GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-from-url
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

FRONTEND_URL=http://localhost:5173
```

> ⚠️ **Catatan Private Key:**
>
> - Copy private_key dari file JSON
> - Ganti semua `\n` menjadi newline actual atau biarkan sebagai `\n`
> - Wrap dalam double quotes

---

## 💻 Instalasi & Development

### Prerequisites

- Node.js 18+
- npm atau yarn
- Google Cloud account

### Setup Local

```bash
# 1. Clone repository
git clone <repo-url>
cd LMS_ARDHI

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd backend
npm install
cd ..

# 4. Setup environment files
# Frontend: copy .env.example ke .env
# Backend: copy backend/.env.example ke backend/.env
# Isi dengan nilai yang sesuai

# 5. Jalankan backend (terminal 1)
cd backend
npm run dev
# Server berjalan di http://localhost:5000

# 6. Jalankan frontend (terminal 2)
npm run dev
# App berjalan di http://localhost:5173
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description        | Auth |
| ------ | -------------------- | ------------------ | ---- |
| POST   | `/api/auth/register` | Register user baru | -    |
| POST   | `/api/auth/login`    | Login user         | -    |
| GET    | `/api/auth/me`       | Get current user   | JWT  |
| POST   | `/api/auth/refresh`  | Refresh token      | JWT  |

### Courses

| Method | Endpoint                   | Description       | Auth             |
| ------ | -------------------------- | ----------------- | ---------------- |
| GET    | `/api/courses`             | Get all courses   | -                |
| GET    | `/api/courses/categories`  | Get categories    | -                |
| GET    | `/api/courses/:id`         | Get course detail | -                |
| POST   | `/api/courses`             | Create course     | JWT (instructor) |
| POST   | `/api/courses/:id/modules` | Add module        | JWT (instructor) |

### Lessons

| Method | Endpoint                   | Description        | Auth             |
| ------ | -------------------------- | ------------------ | ---------------- |
| GET    | `/api/lessons/:id`         | Get lesson + quiz  | JWT              |
| POST   | `/api/lessons`             | Create lesson      | JWT (instructor) |
| POST   | `/api/lessons/:id/quizzes` | Add quiz questions | JWT (instructor) |

### Quiz

| Method | Endpoint                     | Description         | Auth |
| ------ | ---------------------------- | ------------------- | ---- |
| GET    | `/api/quiz/lesson/:lessonId` | Get quiz questions  | -    |
| POST   | `/api/quiz/submit`           | Submit quiz answers | JWT  |

### Progress

| Method | Endpoint                         | Description         | Auth |
| ------ | -------------------------------- | ------------------- | ---- |
| GET    | `/api/progress/:userId`          | Get user progress   | JWT  |
| GET    | `/api/progress/course/:courseId` | Get course progress | JWT  |

---

## 🚀 Deployment Guide

### Deploy Frontend ke Vercel

1. **Push code ke GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy di Vercel**
   - Buka [Vercel](https://vercel.com/)
   - Klik "Import Project"
   - Connect GitHub repository
   - Framework Preset: Vite
   - Root Directory: `./` (root)
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables di Vercel**
   - Settings > Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.railway.app/api`

### Deploy Backend ke Railway

1. **Siapkan repository**
   - Pastikan file `backend/package.json` ada script `start`
   - Pastikan `.env.example` ada di backend folder

2. **Deploy di Railway**
   - Buka [Railway](https://railway.app/)
   - Klik "New Project" > "Deploy from GitHub repo"
   - Connect repository
   - Settings:
     - Root Directory: `/backend`
     - Start Command: `npm start`

3. **Set Environment Variables di Railway**
   - Variables tab
   - Add semua variabel dari `.env`:
     ```
     PORT=5000
     NODE_ENV=production
     JWT_SECRET=xxx
     JWT_EXPIRES_IN=7d
     GOOGLE_SPREADSHEET_ID=xxx
     GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx
     GOOGLE_PRIVATE_KEY=xxx
     FRONTEND_URL=https://your-app.vercel.app
     ```

4. **Update CORS**
   - Setelah deploy Vercel, update `FRONTEND_URL` di Railway dengan URL Vercel

### Alternative: Deploy ke Render (Free)

1. Buka [Render](https://render.com/)
2. New > Web Service
3. Connect repository
4. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables

---

## 📈 Future Upgrades

### Fase 1: Database Migration

```javascript
// Migrasi ke PostgreSQL ketika user > 1000
// Gunakan Prisma ORM
npm install prisma @prisma/client
npx prisma init
```

### Fase 2: Subscription System

```javascript
// Tambah table Subscriptions
// Kolom: id, user_id, plan, price, status, start_date, end_date

// Middleware untuk check subscription
const checkSubscription = async (req, res, next) => {
  const subscription = await getActiveSubscription(req.user.id);
  if (!subscription) {
    return res.status(403).json({ message: 'Subscription required' });
  }
  next();
};
```

### Fase 3: Payment Integration (Midtrans)

```javascript
// Install Midtrans SDK
npm install midtrans-client

// Payment endpoint
router.post('/payment/create', async (req, res) => {
  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY
  });

  const transaction = await snap.createTransaction({
    transaction_details: { order_id, gross_amount },
    customer_details: { email, name }
  });

  res.json({ token: transaction.token });
});
```

### Fase 4: AI Quiz Generator

```javascript
// Integrasi OpenAI untuk generate quiz
import OpenAI from 'openai';

const generateQuiz = async (lessonContent) => {
  const openai = new OpenAI();
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'user',
        content: `Generate 5 multiple choice questions based on: ${lessonContent}`,
      },
    ],
  });
  return parseQuizFromResponse(response);
};
```

---

## 🔒 Security Best Practices

1. **Password Security** - bcrypt dengan salt rounds 10+
2. **JWT** - Token expire dalam 7 hari, refresh token tersedia
3. **Input Validation** - express-validator di setiap endpoint
4. **CORS** - Hanya allow frontend URL
5. **Credentials** - Semua credentials di environment variables
6. **Google Sheets** - Backend sebagai proxy, frontend tidak akses langsung

---

## 📝 License

MIT License - Bebas digunakan untuk keperluan komersial dan non-komersial.

---

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

Made with ❤️ by LMS Ardhi Team
