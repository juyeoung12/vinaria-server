import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import lpRoutes from './routes/lps.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/adminRoutes.js';
import fileRoutes from './routes/fileRoutes.js';

dotenv.config();
const app = express();

console.log('MONGO_URI:', process.env.MONGO_URI);

// 🔹 CORS 허용 도메인
const allowedOrigins = [
  'http://localhost:5173',
  'https://vinaria.vercel.app' // ← 배포된 클라이언트 주소로 교체
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// 🔹 DB 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ DB 연결됨'))
.catch(err => console.error('❌ DB 연결 실패:', err));

// 🔹 정적 파일 제공 (예: /uploads/audio)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 🔹 API 라우팅
app.use('/api/lps', lpRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/files', fileRoutes);

// 🔹 에러 핸들링 (선택)
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ 서버 실행: http://localhost:${PORT}`));
