import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { User, CreateUserDTO } from '../types/user.types';
import { Motorcycle, CreateMotorcycleDTO } from '../types/motorcycle.types';

dotenv.config();

export class DatabaseService {
    private static instance: DatabaseService;
    private supabase: SupabaseClient;

    constructor(supabaseUrl?: string, supabaseKey?: string) {
        const url = supabaseUrl || process.env.SUPABASE_URL;
        const key = supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !key) {
            throw new Error('Supabase configuration is missing. Please check your environment variables.');
        }

        this.supabase = createClient(url, key);
    }

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    // Getter pour les tests
    public getClient(): SupabaseClient {
        return this.supabase;
    }

    // Méthodes utilisateurs
    async createUser(clerkId: string, userData: Omit<CreateUserDTO, 'clerkId'>): Promise<User> {
        const { data, error } = await this.supabase
            .from('users')
            .insert([{
                clerk_id: clerkId,
                username: userData.username,
                email: userData.email,
                full_name: userData.fullName,
                avatar_url: userData.avatarUrl
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async getUserByClerkId(clerkId: string): Promise<User | null> {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('clerk_id', clerkId)
            .single();

        if (error) throw error;
        return data;
    }

    // Méthodes motos
    async createMotorcycle(userId: string, motorcycleData: CreateMotorcycleDTO): Promise<Motorcycle> {
        const { data, error } = await this.supabase
            .from('motorcycles')
            .insert([{
                user_id: userId,
                ...motorcycleData
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async getUserMotorcycles(userId: string): Promise<Motorcycle[]> {
        const { data, error } = await this.supabase
            .from('motorcycles')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        return data || [];
    }

    // Méthode utilitaire pour gérer les erreurs Supabase
    private handleError(error: any): never {
        console.error('Erreur Supabase:', error);
        throw new Error(error.message || 'Erreur de base de données');
    }

    // Méthode de recherche pour récupérer utilisateurs et motos
    async search(query: string, currentUserId: string, filters?: { userFilter: boolean; motorcycleFilter: boolean }) {
        const searchTerm = `%${query}%`;

        // Recherche des utilisateurs
        const usersQuery = filters?.userFilter ?? true; // Si la recherche des utilisateurs est activée
        const motorcyclesQuery = filters?.motorcycleFilter ?? true; // Si la recherche des motos est activée

        const [users, motorcycles] = await Promise.all([
            usersQuery ?
                this.supabase
                    .from('users')
                    .select('*')
                    .ilike('username', searchTerm)
                    .or('full_name.ilike', searchTerm)
                    .neq('id', currentUserId) // Exclure l'utilisateur actuel
                    .limit(10) // Limite à 10 résultats
                : Promise.resolve({ data: [] }),

            motorcyclesQuery ?
                this.supabase
                    .from('motorcycles')
                    .select('*')
                    .ilike('brand', searchTerm) // Recherche sur la marque
                    .ilike('model', searchTerm) // Recherche sur le modèle
                    .eq('user_id', currentUserId) // Filtrer par user_id
                    .limit(10) // Limite à 10 résultats
                : Promise.resolve({ data: [] }),
        ]);

        return {
            users: users.data,
            motorcycles: motorcycles.data,
        };
    }
}

export const db = DatabaseService.getInstance();
