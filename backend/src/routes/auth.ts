import { Router } from 'express';

export const authRouter = Router();

// Mock auth endpoints - integrate with Firebase Auth in production
authRouter.post('/register', (req, res) => {
  res.json({ success: true, data: { userId: 'mock-user-id' } });
});

authRouter.post('/login', (req, res) => {
  res.json({ success: true, data: { token: 'mock-token' } });
});

authRouter.post('/logout', (req, res) => {
  res.json({ success: true });
});

authRouter.get('/me', (req, res) => {
  res.json({ 
    success: true, 
    data: { 
      id: 'user-1', 
      email: 'user@example.com', 
      name: '測試用戶',
      language: 'zh-TW',
      district: '油尖旺'
    } 
  });
});
