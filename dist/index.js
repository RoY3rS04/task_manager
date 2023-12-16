"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_js_1 = __importDefault(require("./src/models/User.js"));
const app = (0, express_1.default)();
const port = 3030;
dotenv_1.default.config();
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
app.get('/', async (req, resp) => {
    try {
        const result = await User_js_1.default.updateOne(6, {
            password: 'elmeroshrek',
        });
        resp.json(result);
    }
    catch (error) {
        resp.json(error);
    }
});
