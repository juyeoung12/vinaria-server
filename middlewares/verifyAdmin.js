// ✅ ESM 방식 export로 변경
export const verifyAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: '관리자만 접근 가능합니다.' });
  }
  next();
};
