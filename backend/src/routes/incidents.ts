import { Router } from 'express';

export const incidentsRouter = Router();

// Mock data - replace with Firestore in production
const incidents = [
  { id: '1', type: 'accident', lat: 22.3200, lng: 114.1700, title: '旺角道有壞車', description: '一架貨車死火', upvotes: 42, distance: 0.3 },
  { id: '2', type: 'traffic', lat: 22.3250, lng: 114.1680, title: '窩打老道塞車', description: '交通繁忙', upvotes: 28, distance: 0.6 },
];

// GET /api/incidents
incidentsRouter.get('/', (req, res) => {
  const { lat, lng, radius = 5 } = req.query;
  res.json({ success: true, data: incidents });
});

// POST /api/incidents
incidentsRouter.post('/', (req, res) => {
  const newIncident = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date(),
  };
  incidents.push(newIncident as any);
  res.json({ success: true, data: newIncident });
});

// POST /api/incidents/:id/upvote
incidentsRouter.post('/:id/upvote', (req, res) => {
  const incident = incidents.find(i => i.id === req.params.id);
  if (incident) {
    (incident as any).upvotes++;
    res.json({ success: true, data: incident });
  } else {
    res.status(404).json({ success: false, error: 'Not found' });
  }
});
