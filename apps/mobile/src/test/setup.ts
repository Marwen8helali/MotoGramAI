import '@testing-library/jest-native/extend-expect';
import { cleanup } from '@testing-library/react-native';

// Nettoyage après chaque test
afterEach(cleanup);

// Mock de fetch global
global.fetch = jest.fn();

// Mock des variables d'environnement
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      apiUrl: 'http://test-api.com',
      clerkPublishableKey: 'test-key',
    },
  },
}));

// Mock de Clerk
jest.mock('@clerk/clerk-expo', () => ({
  useAuth: () => ({
    getToken: jest.fn().mockResolvedValue('test-token'),
    userId: 'test-user-id',
  }),
})); 