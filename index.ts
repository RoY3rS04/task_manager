import express from 'express';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Task from './src/models/Task.js';
import TeamWork from './src/models/TeamWork.js';

const app = express();
const port = 3030;

dotenv.config();

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

app.get('/', async (req, resp) => {

    try {
        
        const team = await TeamWork.deleteOne(2);

        resp.json(team);

    } catch (error) {
        console.log(error);
        resp.json(error);
    }
})