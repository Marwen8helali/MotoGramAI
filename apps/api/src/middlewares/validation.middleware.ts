import { Request, Response, NextFunction } from 'express';

export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
    const { clerkId, username, email } = req.body;

    if (!clerkId || typeof clerkId !== 'string') {
        return res.status(400).json({ error: 'clerkId invalide' });
    }

    if (!username || typeof username !== 'string' || username.length < 3) {
        return res.status(400).json({ error: 'username invalide (minimum 3 caractères)' });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ error: 'email invalide' });
    }

    next();
};

export const validateCreateMotorcycle = (req: Request, res: Response, next: NextFunction) => {
    const { brand, model, year } = req.body;

    if (!brand || typeof brand !== 'string') {
        return res.status(400).json({ error: 'marque invalide' });
    }

    if (!model || typeof model !== 'string') {
        return res.status(400).json({ error: 'modèle invalide' });
    }

    if (year && (typeof year !== 'number' || year < 1885 || year > new Date().getFullYear() + 1)) {
        return res.status(400).json({ error: 'année invalide' });
    }

    next();
}; 