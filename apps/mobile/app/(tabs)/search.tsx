import { View, StyleSheet, ScrollView } from "react-native";
import { Searchbar, Text, IconButton, Portal, Modal } from "react-native-paper";
import { useState, useCallback, useEffect } from "react";
import { useSearch } from "../../src/hooks/useSearch";
import { UserList } from "../../src/components/UserList";
import { MotorcycleList } from "../../src/components/MotorcycleList";
import { SearchFilters } from "../../src/components/SearchFilters";
import { SearchSuggestions } from "../../src/components/SearchSuggestions";
import { debounce } from "../../src/utils/debounce";

interface SearchFiltersState {
  brand?: string;
  yearMin?: number;
  yearMax?: number;
  sortBy: 'recent' | 'popular';
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFiltersState>({ sortBy: 'recent' });
  const { results, suggestions, isLoading, search, fetchSuggestions } = useSearch();

  const debouncedSearch = useCallback(
    debounce((query: string, searchFilters: SearchFiltersState) => {
      search(query, searchFilters);
    }, 300),
    []
  );

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query, filters);
  };

  const handleSelectSuggestion = (query: string) => {
    setSearchQuery(query);
    search(query, filters);
  };

  const handleApplyFilters = (newFilters: SearchFiltersState) => {
    setFilters(newFilters);
    setShowFilters(false);
    if (searchQuery.trim()) {
      search(searchQuery, newFilters);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <Searchbar
          placeholder="Rechercher des utilisateurs ou des motos"
          onChangeText={handleSearch}
          value={searchQuery}
          loading={isLoading}
          style={styles.searchBar}
        />
        <IconButton
          icon="tune"
          onPress={() => setShowFilters(true)}
          mode={Object.keys(filters).length > 1 ? "contained" : "outlined"}
        />
      </View>

      <ScrollView style={styles.content}>
        {!searchQuery.trim() ? (
          <SearchSuggestions
            history={suggestions.history}
            popular={suggestions.popular}
            onSelectSuggestion={handleSelectSuggestion}
          />
        ) : (
          <>
            {results.users.length > 0 && (
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Utilisateurs
                </Text>
                <UserList users={results.users} />
              </View>
            )}

            {results.motorcycles.length > 0 && (
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Motos
                </Text>
                <MotorcycleList motorcycles={results.motorcycles} />
              </View>
            )}

            {results.users.length === 0 && results.motorcycles.length === 0 && (
              <View style={styles.empty}>
                <Text>Aucun résultat trouvé</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={showFilters}
          onDismiss={() => setShowFilters(false)}
          contentContainerStyle={styles.modalContent}
        >
          <SearchFilters
            onApplyFilters={handleApplyFilters}
          />
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 8,
  },
  searchBar: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  empty: {
    padding: 16,
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 8,
  },
}); 