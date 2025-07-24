import User from '../models/User.js';
import File from '../models/File.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    res.status(200).json({ users });
  } catch (err) {
    console.error('회원 목록 불러오기 실패:', err);
    res.status(500).json({ message: '회원 목록 불러오기 실패' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: '삭제 성공' });
  } catch (err) {
    console.error('회원 삭제 실패:', err);
    res.status(500).json({ message: '삭제 실패' });
  }
};

// ✅ 파일 정보 수정 (ID 기준)
export const updateFileById = async (req, res) => {
  const { id } = req.params;
  const { title, category, uploader, date } = req.body;

  try {
    const file = await File.findById(id);
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
};
