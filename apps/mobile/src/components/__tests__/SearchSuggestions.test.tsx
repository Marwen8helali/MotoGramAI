import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchSuggestions } from '../SearchSuggestions';

const mockHistory = [
  { query: 'Honda CBR' },
  { query: 'Yamaha R1' },
];

const mockPopular = [
  { query: 'Kawasaki Ninja', count: 42 },
  { query: 'Ducati Monster', count: 28 },
];

describe('SearchSuggestions', () => {
  it('should render history and popular searches', () => {
    const { getByText } = render(
      <SearchSuggestions
        history={mockHistory}
        popular={mockPopular}
        onSelectSuggestion={jest.fn()}
      />
    );

    // Vérifier les titres des sections
    expect(getByText('Recherches récentes')).toBeTruthy();
    expect(getByText('Recherches populaires')).toBeTruthy();

    // Vérifier les suggestions d'historique
    mockHistory.forEach(item => {
      expect(getByText(item.query)).toBeTruthy();
    });

    // Vérifier les suggestions populaires
    mockPopular.forEach(item => {
      expect(getByText(`${item.query} (${item.count})`)).toBeTruthy();
    });
  });

  it('should call onSelectSuggestion when a suggestion is pressed', () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(
      <SearchSuggestions
        history={mockHistory}
        popular={mockPopular}
        onSelectSuggestion={mockOnSelect}
      />
    );

    // Tester une suggestion de l'historique
    fireEvent.press(getByText('Honda CBR'));
    expect(mockOnSelect).toHaveBeenCalledWith('Honda CBR');

    // Tester une suggestion populaire
    fireEvent.press(getByText('Kawasaki Ninja (42)'));
    expect(mockOnSelect).toHaveBeenCalledWith('Kawasaki Ninja');
  });

  it('should not render history section when empty', () => {
    const { queryByText } = render(
      <SearchSuggestions
        history={[]}
        popular={mockPopular}
        onSelectSuggestion={jest.fn()}
      />
    );

    expect(queryByText('Recherches récentes')).toBeNull();
  });

  it('should not render popular section when empty', () => {
    const { queryByText } = render(
      <SearchSuggestions
        history={mockHistory}
        popular={[]}
        onSelectSuggestion={jest.fn()}
      />
    );

    expect(queryByText('Recherches populaires')).toBeNull();
  });
}); 