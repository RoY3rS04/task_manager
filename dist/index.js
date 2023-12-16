"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql2_1 = __importDefault(require("mysql2"));
const app = (0, express_1.default)();
const port = 3030;
const connection = mysql2_1.default.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'task_manager'
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
app.get('/', (req, resp) => {
    connection.query('SELECT * FROM users', (err, results) => {
        resp.json({
            results
        });
    });
});
