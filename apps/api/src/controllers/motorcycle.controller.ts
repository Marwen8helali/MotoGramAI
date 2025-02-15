import { Request, Response } from 'express';
import { db } from '../services/database.service';

export class MotorcycleController {
    static async createMotorcycle(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const { brand, model, year, photos, specs } = req.body;

            if (!brand || !model) {
                return res.status(400).json({
                    error: 'Les champs brand et model sont requis'
                });
            }

            const motorcycle = await db.createMotorcycle(userId, {
                brand,
                model,
                year,
                photos,
                specs
            });

            res.status(201).json(motorcycle);
        } catch (error: any) {
            res.status(500).json({
                error: 'Erreur lors de la création de la moto',
                details: error.message
            });
        }
    }

    static async getUserMotorcycles(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const motorcycles = await db.getUserMotorcycles(userId);

            res.json(motorcycles);
        } catch (error: any) {
            res.status(500).json({
                error: 'Erreur lors de la récupération des motos',
                details: error.message
            });
        }
    }
} 