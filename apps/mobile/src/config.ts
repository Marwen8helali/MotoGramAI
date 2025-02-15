import Constants from 'expo-constants';

export const config = {
  apiUrl: Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000',
  clerkPublishableKey: Constants.expoConfig?.extra?.clerkPublishableKey || '',
}; 