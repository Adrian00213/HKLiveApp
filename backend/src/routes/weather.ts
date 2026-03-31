import { Router } from 'express';
export const weatherRouter = Router();

weatherRouter.get('/aqhi', (req, res) => {
  res.json({
    success: true,
    data: [
      { district: '中西區', value: 3, level: 'low' },
      { district: '灣仔', value: 5, level: 'medium' },
      { district: '油尖旺', value: 6, level: 'medium' },
      { district: '觀塘', value: 7, level: 'medium' },
    ],
  });
});

weatherRouter.get('/forecast', (req, res) => {
  res.json({
    success: true,
    data: [
      { date: '2026-04-01', temp: 28, description: '大致天晴' },
      { date: '2026-04-02', temp: 26, description: '多雲' },
    ],
  });
});
