import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { User, CreateUserDTO } from '../types/user.types';
import { Motorcycle, CreateMotorcycleDTO } from '../types/motorcycle.types';

dotenv.config();

export class DatabaseService {
    private static instance: DatabaseService;
    private supabase: SupabaseClient;

    constructor(supabaseUrl?: string, supabaseKey?: string) {
        this.supabase = createClient(
            supabaseUrl || process.env.SUPABASE_URL || '',
            supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
        );
    }

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    // Pour les tests
    public static resetInstance(): void {
        DatabaseService.instance = undefined as any;
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
}

export const dbService = DatabaseService.getInstance(); 