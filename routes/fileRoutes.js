import express from 'express';
import File from '../models/File.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

// 🔹 전체 파일 목록 조회 (관리자 전용)
router.get('/', async (req, res) => {
  try {
    const files = await File.find().sort({ date: -1 });
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: '파일 불러오기 실패' });
  }
});

// 🔹 특정 파일 삭제
router.delete('/:name', async (req, res) => {
  try {
    const result = await File.deleteOne({ name: req.params.name });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: '파일을 찾을 수 없습니다' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: '삭제 실패' });
  }
});

// ✅ 🔹 사용자 본인의 파일만 조회 (/files/my/files)
router.get('/my/files', verifyToken, async (req, res) => {
  try {
    const userFiles = await File.find({ uploader: req.user.userId }).sort({ date: -1 });
    res.json({ files: userFiles });
  } catch (err) {
    res.status(500).json({ error: '내 파일 조회 실패' });
  }
});

export default router;
