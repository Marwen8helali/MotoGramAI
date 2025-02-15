import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingScreen } from '../LoadingScreen';

describe('LoadingScreen', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(<LoadingScreen />);
    
    // Vérifier que l'indicateur de chargement est présent
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('should have correct styles', () => {
    const { getByTestId } = render(<LoadingScreen />);
    const container = getByTestId('loading-container');

    // Vérifier les styles du conteneur
    expect(container).toHaveStyle({
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    });
  });
}); 