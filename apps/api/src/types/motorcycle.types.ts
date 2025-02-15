export interface Motorcycle {
    id: string;
    user_id: string;
    brand: string;
    model: string;
    year?: number;
    photos?: string[];
    specs?: Record<string, any>;
    created_at: Date;
    updated_at: Date;
}

export interface CreateMotorcycleDTO {
    brand: string;
    model: string;
    year?: number;
    photos?: string[];
    specs?: Record<string, any>;
} 