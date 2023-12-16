import express from 'express';
import dotenv from 'dotenv';

const app = express();
const port = 3030;

dotenv.config();

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

app.get('/', (req, resp) => {

})