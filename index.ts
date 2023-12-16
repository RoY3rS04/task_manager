import express from 'express';
import dotenv from 'dotenv';
import User from './src/models/User.js';

const app = express();
const port = 3030;

dotenv.config();

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

app.get('/', async (req, resp) => {

    try {
        const result = await User.updateOne(6, {
            password: 'elmeroshrek',
        });

        resp.json(result);
    } catch (error) {
        resp.json(error);
    }
})