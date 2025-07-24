import express from 'express';
import Lp from '../models/Lp.js';

console.log('📦 lps 라우터 정상 로드됨');

const router = express.Router();

// 🔹 LP 전체 조회 또는 장르 필터링
router.get('/', async (req, res) => {
  try {
    const { genre } = req.query;
    const filter = genre ? { genre } : {};
    const lps = await Lp.find(filter);
    res.json(lps);
  } catch (err) {
    console.error("LP 목록 조회 실패:", err);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 🔸 LP 상세 조회: "lp001" 같은 수동 id로 조회
router.get('/:id', async (req, res) => {
  try {
    const lp = await Lp.findOne({ id: req.params.id });
    if (!lp) {
      console.log(`❗ LP not found with id: ${req.params.id}`);
      return res.status(404).json({ message: 'LP를 찾을 수 없습니다.' });
    }
    res.json(lp);
  } catch (err) {
    console.error("❌ LP 상세 조회 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

export default router;
