import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Token de autenticação não fornecido.' });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
        if (err) {
            res.status(403).json({ message: 'Token inválido ou expirado.' });
            return;
        }

        req.user = user as any; 
        next(); 
    });
};
