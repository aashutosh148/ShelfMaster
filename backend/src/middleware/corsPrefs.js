import cors from 'cors';

const corsPrefs = cors({
  origin: ['*', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  headers: ['Content-Type', 'authorization']
});

export default corsPrefs;
