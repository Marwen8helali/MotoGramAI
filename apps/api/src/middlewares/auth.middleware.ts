import { Request, Response, NextFunction } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

// Wrap Clerk's middleware to ensure consistent auth handling
export const authMiddleware = ClerkExpressRequireAuth({
    // Optional configuration can be added here if needed
    onError: (err, _req, res) => {
        console.error('Authentication error:', err);
        res.status(401).json({ error: 'Authentication required' });
    }
});