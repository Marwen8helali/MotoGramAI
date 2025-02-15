import { View, StyleSheet } from 'react-native';
import { Button, TextInput, SegmentedButtons } from 'react-native-paper';
import { useState } from 'react';

interface SearchFilters {
  brand?: string;
  yearMin?: number;
  yearMax?: number;
  sortBy: 'recent' | 'popular';
}

interface SearchFiltersProps {
  onApplyFilters: (filters: SearchFilters) => void;
}

export function SearchFilters({ onApplyFilters }: SearchFiltersProps) {
  const [brand, setBrand] = useState('');
  const [yearMin, setYearMin] = useState('');
  const [yearMax, setYearMax] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  const handleApply = () => {
    onApplyFilters({
      brand: brand || undefined,
      yearMin: yearMin ? parseInt(yearMin) : undefined,
      yearMax: yearMax ? parseInt(yearMax) : undefined,
      sortBy,
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Marque"
        value={brand}
        onChangeText={setBrand}
        style={styles.input}
      />
      <View style={styles.row}>
        <TextInput
          label="Année min"
          value={yearMin}
          onChangeText={setYearMin}
          keyboardType="numeric"
          style={[styles.input, styles.halfInput]}
        />
        <TextInput
          label="Année max"
          value={yearMax}
          onChangeText={setYearMax}
          keyboardType="numeric"
          style={[styles.input, styles.halfInput]}
        />
      </View>

      <SegmentedButtons
        value={sortBy}
        onValueChange={setSortBy as (value: string) => void}
        buttons={[
          { value: 'recent', label: 'Récent' },
          { value: 'popular', label: 'Populaire' },
        ]}
        style={styles.segmentedButtons}
      />

      <Button mode="contained" onPress={handleApply} style={styles.button}>
        Appliquer les filtres
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
}); 