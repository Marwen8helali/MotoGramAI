import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SearchSuggestion {
  query: string;
  count?: number;
}

interface SearchSuggestionsProps {
  history: SearchSuggestion[];
  popular: SearchSuggestion[];
  onSelectSuggestion: (query: string) => void;
}

export function SearchSuggestions({ history, popular, onSelectSuggestion }: SearchSuggestionsProps) {
  return (
    <ScrollView style={styles.container}>
      {history.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="history" size={20} color="#666" />
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Recherches récentes
            </Text>
          </View>
          <View style={styles.chips}>
            {history.map((item) => (
              <Chip
                key={item.query}
                onPress={() => onSelectSuggestion(item.query)}
                style={styles.chip}
              >
                {item.query}
              </Chip>
            ))}
          </View>
        </View>
      )}

      {popular.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="trending-up" size={20} color="#666" />
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Recherches populaires
            </Text>
          </View>
          <View style={styles.chips}>
            {popular.map((item) => (
              <Chip
                key={item.query}
                onPress={() => onSelectSuggestion(item.query)}
                style={styles.chip}
              >
                {item.query} {item.count && `(${item.count})`}
              </Chip>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    marginLeft: 8,
    color: '#666',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 4,
  },
}); 