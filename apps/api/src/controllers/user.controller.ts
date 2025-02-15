import { Request, Response } from 'express';
import { db } from '../services/database.service';

export class UserController {
    static async createUser(req: Request, res: Response) {
        try {
            const { clerkId, username, email, fullName, avatarUrl } = req.body;

            if (!clerkId || !username || !email) {
                return res.status(400).json({
                    error: 'Les champs clerkId, username et email sont requis'
                });
            }

            const user = await db.createUser(clerkId, {
                username,
                email,
                fullName,
                avatarUrl
            });

            res.status(201).json(user);
        } catch (error: any) {
            res.status(500).json({
                error: 'Erreur lors de la création de l\'utilisateur',
                details: error.message
            });
        }
    }

    static async getUserProfile(req: Request, res: Response) {
        try {
            const clerkId = req.params.clerkId;
            const user = await db.getUserByClerkId(clerkId);

            if (!user) {
                return res.status(404).json({
                    error: 'Utilisateur non trouvé'
                });
            }

            res.json(user);
        } catch (error: any) {
            res.status(500).json({
                error: 'Erreur lors de la récupération du profil',
                details: error.message
            });
        }
    }
} 