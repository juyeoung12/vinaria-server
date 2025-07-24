// server/scripts/seedFiles.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import File from '../models/File.js';         // 파일 모델
import fileData from './fileData.js';         // 더미 데이터

// __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env 로드
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log('📡 MONGO_URI:', process.env.MONGO_URI);

const insert = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await File.create(fileData);

    console.log('✅ 파일 더미 데이터 저장 완료!');
    process.exit();
  } catch (err) {
    console.error('❌ 저장 오류:', err);
    process.exit(1);
  }
};

insert();
