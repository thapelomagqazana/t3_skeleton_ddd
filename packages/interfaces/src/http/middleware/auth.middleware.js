"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const authGuard = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.replace('Bearer', '').trim();
    if (!token || token === 'null' || token.trim() === '') {
        return res.status(403).json({ error: 'Invalid token' });
    }
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        req.user = decoded;
        next();
    }
    catch (_a) {
        return res.status(403).json({ error: 'Unauthorized or expired token' });
    }
};
exports.authGuard = authGuard;
