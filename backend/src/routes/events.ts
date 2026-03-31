import { Router } from 'express';
export const eventsRouter = Router();

const events = [
  { id: '1', type: 'concert', title: 'MIRROR 演唱會', venue: '亞博', price: '$680', distance: 8.5 },
  { id: '2', type: 'festival', title: '美酒佳餚節', venue: '中環海濱', price: '免費', distance: 3.2 },
];

eventsRouter.get('/', (req, res) => {
  res.json({ success: true, data: events });
});
