
import express from 'express';
import cors from "cors";
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import tours from './routers/tours.js';
import authRoutes from './routers/auth.js';
import bookingRoutes from './routers/booking.js';
import { authenticateToken } from './middleware.js';
import pushRoutes from './routers/push.js';



dotenv.config();
const app = express();
const port =  3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname,'..' ,'public')));


app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}))


app.use('/api/tours', tours);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/push', pushRoutes);
app.get('/api/me', authenticateToken, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true, name: true, role: true }
  });
  res.json(user);
});



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});