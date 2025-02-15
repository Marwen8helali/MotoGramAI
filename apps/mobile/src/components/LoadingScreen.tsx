import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export function LoadingScreen() {
  return (
    <View style={styles.container} testID="loading-container">
      <ActivityIndicator size="large" testID="loading-indicator" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
}); 