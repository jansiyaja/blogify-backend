"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const userRoute_1 = require("./Routes/userRoute");
const cors_1 = __importDefault(require("cors"));
const errorhandler_1 = __importDefault(require("./middleware/errorhandler"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
console.log(process.env.FRONTEND_URL);
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use('/users', userRoute_1.userRouter);
app.use(errorhandler_1.default);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port} http://localhost:8000`);
});
