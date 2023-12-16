import express from 'express';
import mysql from 'mysql2';

const app = express();
const port = 3030;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'task_manager'
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

app.get('/', (req, resp) => {

    connection.query(
        'SELECT * FROM users',
        (err, results) => {
            resp.json({
                results
            });
        }
    );
})