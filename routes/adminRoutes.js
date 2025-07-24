import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { verifyToken } from '../middlewares/verifyToken.js';
import { verifyAdmin } from '../middlewares/verifyAdmin.js';
import { getAllUsers, deleteUser, updateFileById } from '../controllers/adminController.js'; // ✅ updateFileById 추가
import User from '../models/User.js';
import File from '../models/File.js';

const router = express.Router();

const uploadDir = path.join('uploads', 'audio');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `audio-${timestamp}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

// 🔸 파일 업로드
router.post('/upload', verifyToken, verifyAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });

  const fileInfo = {
    name: req.file.filename,
    title: req.file.originalname,
    type: req.file.mimetype,
    uploader: req.body.uploader || req.user?._id, // ✅ uploader를 req.body 또는 토큰에서
    category: '기타',
    date: new Date(),
  };

  try {
    const savedFile = await File.create(fileInfo);
    res.status(200).json({
      message: '업로드 성공',
      filePath: `/uploads/audio/${req.file.filename}`,
      ...savedFile._doc,
    });
  } catch (err) {
    console.error('파일 저장 오류:', err);
    res.status(500).json({ message: '파일 저장 실패' });
  }
});

// 🔸 파일 목록 조회
router.get('/files', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const files = await File.find().sort({ date: -1 });
    res.status(200).json({ files });
  } catch (err) {
    console.error('파일 목록 조회 오류:', err);
    res.status(500).json({ message: '파일 목록 불러오기 실패' });
  }
});

// 🔸 파일 삭제
router.delete('/files/:filename', verifyToken, verifyAdmin, async (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  if (filename.includes('..')) return res.status(400).json({ message: '잘못된 파일 이름입니다.' });

  const filePath = path.join(uploadDir, filename);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await File.deleteOne({ name: filename });
    res.status(200).json({ message: '파일 및 DB 정보 삭제 완료' });
  } catch (err) {
    console.error('삭제 에러:', err);
    res.status(500).json({ message: '삭제 실패' });
  }
});

// 🔸 파일 정보 수정 (name 기준 - 기존 호환)
router.patch('/files/:filename', verifyToken, verifyAdmin, async (req, res) => {
  const { filename } = req.params;
  const { title, category, uploader, date } = req.body;

  try {
    const file = await File.findOne({ name: filename });
    if (!file) return res.status(404).json({ message: '파일을 찾을 수 없습니다.' });

    if (title !== undefined) file.title = title;
    if (category !== undefined) file.category = category;
    if (uploader !== undefined) file.uploader = uploader;
    if (date !== undefined) file.date = new Date(date);

    await file.save();
    res.status(200).json({ message: '파일 정보 수정 완료', file });
  } catch (err) {
    console.error('파일 수정 에러:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// ✅ 🔸 파일 정보 수정 (ID 기준 - 사용 중인 라우트)
router.patch('/file-by-id/:id', verifyToken, verifyAdmin, updateFileById);

// 🔸 회원 목록 조회 및 삭제
router.get('/users', verifyToken, verifyAdmin, getAllUsers);
router.delete('/users/:id', verifyToken, verifyAdmin, deleteUser);

// 🔸 내 파일 목록 조회 (fs 기준)
router.get('/my/files', verifyToken, async (req, res) => {
  try {
    const files = await File.find({ uploader: req.user._id }).sort({ date: -1 });
    res.status(200).json({ files });
  } catch (err) {
    console.error('내 파일 조회 오류:', err);
    res.status(500).json({ message: '파일 조회 실패' });
  }
});

export default router;
