import express from 'express';
import Lp from '../models/Lp.js';

const router = express.Router();

console.log('📦 lps 라우터 정상 로드됨');

// 🔹 전체 LP 조회 (장르 필터 포함)
router.get('/', async (req, res) => {
  try {
    const { genre } = req.query;
    console.log('genre filter:', genre);
    const filter = genre ? { genre } : {};
    const lps = await Lp.find(filter);
    console.log('lps count:', lps.length);
    res.json(lps);
  } catch (err) {
    console.error("LP 목록 조회 실패:", err);
    res.status(500).json({ error: '서버 오류', detail: err.message });
  }
});

// ✅ 🔹 LP 상세 조회 (id는 커스텀 string 아이디임!)
router.get('/:id', async (req, res) => {
  try {
    const lp = await Lp.findOne({ id: req.params.id });  // ← 이거 꼭 필요함!
    if (!lp) {
      return res.status(404).json({ message: 'LP를 찾을 수 없습니다.' });
    }
    res.json(lp);
  } catch (err) {
    console.error("LP 조회 실패:", err);
    res.status(500).json({ message: '서버 오류' });
  }
});

export default router;
