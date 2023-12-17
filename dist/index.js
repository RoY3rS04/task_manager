"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const Task_js_1 = __importDefault(require("./src/models/Task.js"));
const app = (0, express_1.default)();
const port = 3030;
dotenv_1.default.config();
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
app.get('/', async (req, resp) => {
    try {
        const result = await Task_js_1.default.deleteOne(1);
        resp.json(result);
    }
    catch (error) {
        console.log(error);
        resp.json(error);
    }
});
