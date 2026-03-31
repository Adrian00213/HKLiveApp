import { Router } from 'express';
export const dealsRouter = Router();

const deals = [
  { id: '1', merchantName: '譚仔雲南米線', title: '下午茶優惠', discount: '7折', distance: 0.15 },
  { id: '2', merchantName: '麥當勞', title: '晚市套餐', discount: '5折', distance: 0.25 },
];

dealsRouter.get('/', (req, res) => {
  res.json({ success: true, data: deals });
});
