import express from 'express';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Task from './src/models/Task.js';

const app = express();
const port = 3030;

dotenv.config();

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

app.get('/', async (req, resp) => {

    try {
        const result = await User.getAll();

        console.log(result);

        resp.json(result);
    } catch (error) {
        console.log(error);
        resp.json(error);
    }
})