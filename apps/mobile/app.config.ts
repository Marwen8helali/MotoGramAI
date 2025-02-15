import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'MotoSocial',
  slug: 'motosocial',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'motosocial',
  experiments: {
    tsconfigPaths: true,
  },
  plugins: [
    'expo-router'
  ],
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
  updates: {
    url: 'https://u.expo.dev/your-project-id'
  },
  android: {
    package: 'com.motosocial.app',
    adaptiveIcon: {
      backgroundColor: '#ffffff'
    }
  },
  ios: {
    bundleIdentifier: 'com.motosocial.app'
  },
  // Activer la nouvelle architecture
  newArchEnabled: true
};

export default config; 