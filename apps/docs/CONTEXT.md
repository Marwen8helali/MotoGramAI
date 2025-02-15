# MotoSocial - Le Réseau Social des Motards 🏍️

## Vision du Projet 🎯
MotoSocial révolutionne l'expérience sociale des motards en créant une plateforme unique qui fusionne le meilleur des réseaux sociaux modernes avec des fonctionnalités spécialement conçues pour la communauté motarde. Notre objectif est de connecter les passionnés, faciliter l'organisation de sorties et enrichir l'expérience motarde au quotidien.

## Stack Technique 🛠️

### Frontend
- **Mobile** : React Native - Applications natives iOS et Android
- **UI/UX** : Design moderne et responsive avec React Native Paper / React Native Elements, utilisation de Figma ou Adobe XD pour les maquettes, animations fluides avec Reanimated, et navigation optimisée avec React Navigation.

### Backend & Services
- **Backend** : nodejs
- **Base de données** : Supabase
- **Authentification** : Clerk
- **Cartographie** : Mapbox
- **Paiements** : Stripe
- **Storage** : Supabase Storage

## Structure du Projet 📂

## Fonctionnalités Clés ⭐

### 📱 Expérience Sociale
- **Fil d'actualité** : Partagez vos aventures en photos et vidéos
- **Stories** : Capturez vos moments en direct
- **Messagerie instantanée** : Restez connecté avec la communauté
- **Groupes & Clubs** : Créez votre communauté ou rejoignez des passionnés

### 🗺️ Rides & Événements
- **Planification de sorties** :
  - Création d'événements personnalisés
  - Gestion des participants
  - Partage d'itinéraires
- **Carte interactive** :
  - Routes favorites des motards
  - Points d'intérêt essentiels (stations, garages)
  - Spots de rencontre populaires
  - Concessionnaires partenaires

### 👤 Profil Motard
- **Garage virtuel** : Présentez vos motos avec fierté
- **Tableau de bord** :
  - Statistiques de sorties
  - Badges et récompenses
  - Historique des rides
- **Réputation** : Système de confiance communautaire

### 🛍️ Marketplace Moto
- **Équipements** : Achat/vente de matériel
- **Motos** : Petites annonces entre particuliers
- **Accessoires** : Pièces et équipements spécialisés
- **Paiements sécurisés** : Transactions protégées via Stripe

## Architecture 🏗️
- Une structure plus claire et professionnelle
- Une documentation plus complète et facile à maintenir
- Une base de code plus robuste et maintenable
- Une meilleure séparation des responsabilités
- Une meilleure gestion des erreurs et des exceptions 

# MotoSocial - Architecture Technique 🏍️

## Structure du Projet 📂

```bash
/
├── apps/
│   ├── api/                        # API Backend
│   │   ├── src/
│   │   │   ├── controllers/       # Logique métier
│   │   │   ├── middlewares/       # Middlewares
│   │   │   ├── routes/           # Routes API
│   │   │   ├── services/         # Services
│   │   │   └── utils/            # Utilitaires
│   │   └── tests/                # Tests
│   │
│   ├── web/                       # Frontend Next.js
│   │   ├── src/
│   │   │   ├── app/              # Pages & Routes
│   │   │   ├── components/       # Composants React
│   │   │   ├── hooks/           # Custom Hooks
│   │   │   ├── lib/             # Utilitaires
│   │   │   └── styles/          # Styles CSS
│   │   └── public/              # Assets statiques
│   │
│   └── mobile/                    # App React Native
│       ├── src/
│       │   ├── screens/          # Écrans
│       │   ├── components/       # Composants
│       │   ├── navigation/       # Navigation
│       │   └── services/         # Services
│       └── assets/               # Assets
│
└── packages/                      # Packages partagés
    ├── config/                   # Configuration
    ├── types/                    # Types TypeScript
    └── ui/                       # UI Kit
```

## Schéma de Base de Données 🗄️

### Tables Principales

```sql
-- Utilisateurs
CREATE TABLE users (
    id UUID PRIMARY KEY,
    clerk_id TEXT UNIQUE,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Motos
CREATE TABLE motorcycles (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    brand TEXT,
    model TEXT,
    year INTEGER,
    photos TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Publications
CREATE TABLE posts (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    content TEXT,
    media_urls TEXT[],
    location JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sorties Moto
CREATE TABLE rides (
    id UUID PRIMARY KEY,
    creator_id UUID REFERENCES users(id),
    title TEXT,
    description TEXT,
    route_data JSONB,
    date TIMESTAMPTZ,
    max_participants INTEGER,
    status TEXT DEFAULT 'planned',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketplace
CREATE TABLE listings (
    id UUID PRIMARY KEY,
    seller_id UUID REFERENCES users(id),
    title TEXT,
    description TEXT,
    price DECIMAL,
    category TEXT,
    images TEXT[],
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tables de Relations

```sql
-- Abonnements
CREATE TABLE follows (
    follower_id UUID REFERENCES users(id),
    following_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);

-- Participants aux sorties
CREATE TABLE ride_participants (
    ride_id UUID REFERENCES rides(id),
    user_id UUID REFERENCES users(id),
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (ride_id, user_id)
);

-- Likes
CREATE TABLE post_likes (
    post_id UUID REFERENCES posts(id),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
);

-- Commentaires
CREATE TABLE comments (
    id UUID PRIMARY KEY,
    post_id UUID REFERENCES posts(id),
    user_id UUID REFERENCES users(id),
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tables de Messagerie

```sql
-- Conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Participants aux conversations
CREATE TABLE conversation_members (
    conversation_id UUID REFERENCES conversations(id),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id)
);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id),
    sender_id UUID REFERENCES users(id),
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Index Optimisés

```sql
-- Index de recherche
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_rides_date ON rides(date);
CREATE INDEX idx_listings_category ON listings(category);

-- Index de relations
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
CREATE INDEX idx_ride_participants_ride ON ride_participants(ride_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
```

## Sécurité et Performance 🔒

### Politiques RLS
```sql
-- Exemple pour posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique"
    ON posts FOR SELECT
    USING (true);

CREATE POLICY "Création par l'utilisateur"
    ON posts FOR INSERT
    WITH CHECK (auth.uid() = user_id);
```

### Optimisations
- Cache Redis pour les données fréquemment accédées
- CDN pour les médias
- Pagination avec curseurs
- Compression des images
```

Cette structure offre :
- Une organisation claire des dossiers
- Un schéma de base de données complet
- Des index optimisés pour les requêtes fréquentes
- Des politiques de sécurité robustes 
