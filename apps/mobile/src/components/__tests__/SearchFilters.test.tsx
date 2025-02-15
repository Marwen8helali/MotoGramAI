import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchFilters } from '../SearchFilters';

describe('SearchFilters', () => {
  it('should render correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <SearchFilters onApplyFilters={jest.fn()} />
    );

    expect(getByText('Appliquer les filtres')).toBeTruthy();
    expect(getByPlaceholderText('Marque')).toBeTruthy();
    expect(getByPlaceholderText('Année min')).toBeTruthy();
    expect(getByPlaceholderText('Année max')).toBeTruthy();
  });

  it('should call onApplyFilters with correct values', () => {
    const mockOnApplyFilters = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <SearchFilters onApplyFilters={mockOnApplyFilters} />
    );

    fireEvent.changeText(getByPlaceholderText('Marque'), 'Honda');
    fireEvent.changeText(getByPlaceholderText('Année min'), '2020');
    fireEvent.changeText(getByPlaceholderText('Année max'), '2023');
    fireEvent.press(getByText('Appliquer les filtres'));

    expect(mockOnApplyFilters).toHaveBeenCalledWith({
      brand: 'Honda',
      yearMin: 2020,
      yearMax: 2023,
      sortBy: 'recent',
    });
  });
}); 