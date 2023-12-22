import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './src/routes/userRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import teamRoutes from './src/routes/teamRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

const app = express();
const port = 3030;

dotenv.config();

app.use(express.json());

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/teams', teamRoutes);
app.use('/users/auth', authRoutes);