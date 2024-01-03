import express from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import userRoutes from './src/routes/userRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import teamRoutes from './src/routes/teamRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import cors from 'cors';

const app = express();
const port = 3030;

dotenv.config();

app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL
}));

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/teams', teamRoutes);
app.use('/users/auth', authRoutes);