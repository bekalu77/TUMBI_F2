import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors({
  origin: ['http://localhost:5173', 'https://*.vercel.app'],
  credentials: true
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Tumbi F1 Backend'
  });
});

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Tumbi F1 Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health'
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
