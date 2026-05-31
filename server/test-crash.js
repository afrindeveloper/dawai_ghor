import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors({
  origin: ['https://dawaighor.vercel.app'].filter(Boolean),
  credentials: true
}));
app.post('/api/users/login', (req, res) => res.json({}));
app.listen(5002, () => console.log('started'));
