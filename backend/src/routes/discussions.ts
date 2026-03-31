import { Router } from 'express';
export const discussionsRouter = Router();

const discussions = [
  { id: '1', district: '油尖旺', title: '廟街夜市', content: '終於搞啦', commentCount: 45, distance: 0.8 },
  { id: '2', district: '油尖旺', title: '邊度有好吃嘅車仔麵', content: '搬呢頭兩個月', commentCount: 23, distance: 0.5 },
];

discussionsRouter.get('/', (req, res) => {
  res.json({ success: true, data: discussions });
});

discussionsRouter.post('/', (req, res) => {
  res.json({ success: true, data: { id: Date.now().toString(), ...req.body } });
});
