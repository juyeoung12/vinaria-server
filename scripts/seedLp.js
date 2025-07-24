// server/scripts/seedLp.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import Lp from '../models/Lp.js';
import lpData from './lpData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log('📡 MONGO_URI:', process.env.MONGO_URI);

const insert = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Lp.deleteMany({});           // 기존 LP 초기화
    await Lp.insertMany(lpData);       // ✅ 배열로 저장

    console.log('✅ LP 데이터 저장 완료!');
    process.exit();
  } catch (err) {
    console.error('❌ 저장 오류:', err);
    process.exit(1);
  }
};

insert();
