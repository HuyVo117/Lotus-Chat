
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js';
import authRoute from './routes/authRoute.js';
import cookieParser from 'cookie-parser'; 
import userRoute from './routes/userRoute.js';
import { protectedRoute } from './middlewares/authMiddleware.js';
import cors from 'cors';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));
// public routes
app.use('/api/auth', authRoute);

//private routes
app.use(protectedRoute) // su dung middleware xac thuc cho cac route sau do
app.use('/api/users', userRoute); //protected route

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();

export default app;
