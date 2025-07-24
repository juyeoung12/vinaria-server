import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import lpRoutes from './routes/lps.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/adminRoutes.js';
import fileRoutes from './routes/fileRoutes.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',         // 개발용
    'https://vinaria.vercel.app'     // 배포된 프론트 주소
  ],
  credentials: true,
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ DB 연결됨'))
  .catch(err => console.error('❌ DB 연결 실패:', err));

app.use('/api/lps', lpRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/files', fileRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ 서버 실행: http://localhost:${PORT}`));
