"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtService_1 = require("../services/jwtService");
const authenticateToken = async (req, res, next) => {
    try {
        const tokenFromHeader = req.headers.authorization?.split(' ')[1];
        if (!tokenFromHeader) {
            const refreshToken = req.body.refreshToken;
            if (!refreshToken) {
                res.status(401).json({ error: 'Access and Refresh tokens are required' });
                return;
            }
            try {
                const decodedRefreshToken = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || '');
                const newAccessToken = (0, jwtService_1.generateAccessToken)(decodedRefreshToken.id);
                res.status(200).json({ accessToken: newAccessToken });
                req.user = { id: String(decodedRefreshToken.id) };
                return next();
            }
            catch (error) {
                res.status(403).json({ error: 'Invalid refresh token' });
                return;
            }
        }
        const decoded = jsonwebtoken_1.default.verify(tokenFromHeader, process.env.ACCESS_TOKEN_SECRET || '');
        req.user = { id: decoded.id };
        return next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({ error: 'Invalid or expired access token' });
            return;
        }
        res.status(500).json({ error: 'Unexpected server error' });
    }
};
exports.authenticateToken = authenticateToken;
