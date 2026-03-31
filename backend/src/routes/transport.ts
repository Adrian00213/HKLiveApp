import { Router } from 'express';
export const transportRouter = Router();

transportRouter.get('/mtr-status', (req, res) => {
  res.json({
    success: true,
    data: [
      { line: '觀塘線', status: 'normal' },
      { line: '荃灣線', status: 'normal' },
      { line: '港島線', status: 'normal' },
      { line: '東鐵線', status: 'delayed', message: '服務稍有延誤' },
    ],
  });
});

transportRouter.get('/bus-arrival', (req, res) => {
  res.json({
    success: true,
    data: [
      { route: '1', destination: '堅尼地城', eta: 2, capacity: 'medium', distance: 0.1 },
      { route: '5', destination: '北角', eta: 5, capacity: 'high', distance: 0.1 },
    ],
  });
});
