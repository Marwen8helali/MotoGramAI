-- Enable les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Table Utilisateurs
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Table Motos
CREATE TABLE motorcycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER,
    photos TEXT[],
    specs JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_motorcycles_updated_at
    BEFORE UPDATE ON motorcycles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Politiques RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE motorcycles ENABLE ROW LEVEL SECURITY;

-- Politiques pour users
CREATE POLICY "Les utilisateurs peuvent voir tous les profils"
    ON users FOR SELECT
    USING (true);

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil"
    ON users FOR UPDATE
    USING (auth.uid() = clerk_id);

-- Politiques pour motorcycles
CREATE POLICY "Tout le monde peut voir les motos"
    ON motorcycles FOR SELECT
    USING (true);

CREATE POLICY "Les utilisateurs peuvent gérer leurs propres motos"
    ON motorcycles FOR ALL
    USING (
        auth.uid() IN (
            SELECT clerk_id 
            FROM users 
            WHERE users.id = motorcycles.user_id
        )
    );

-- Index pour optimiser les performances
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_motorcycles_user_id ON motorcycles(user_id); 