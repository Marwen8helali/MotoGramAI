import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { FollowButton } from '../FollowButton';

// Mock du hook useLikes
jest.mock('../../hooks/useFollow', () => ({
  useFollow: () => ({
    toggleFollow: jest.fn().mockImplementation(async (currentStatus) => !currentStatus),
    isLoading: false,
    error: null,
  }),
}));

describe('FollowButton', () => {
  it('should render correctly with initial following state', () => {
    const { getByText } = render(
      <FollowButton
        userId="user-1"
        isFollowing={true}
        onFollowChange={jest.fn()}
      />
    );

    expect(getByText('Abonné')).toBeTruthy();
  });

  it('should render correctly with initial not following state', () => {
    const { getByText } = render(
      <FollowButton
        userId="user-1"
        isFollowing={false}
        onFollowChange={jest.fn()}
      />
    );

    expect(getByText("S'abonner")).toBeTruthy();
  });

  it('should call onFollowChange when pressed', async () => {
    const mockOnFollowChange = jest.fn();
    const { getByText } = render(
      <FollowButton
        userId="user-1"
        isFollowing={false}
        onFollowChange={mockOnFollowChange}
      />
    );

    await act(async () => {
      fireEvent.press(getByText("S'abonner"));
    });

    expect(mockOnFollowChange).toHaveBeenCalledWith(true);
  });

  it('should handle loading state', () => {
    // Remplacer le mock pour simuler le chargement
    jest.mock('../../hooks/useFollow', () => ({
      useFollow: () => ({
        toggleFollow: jest.fn(),
        isLoading: true,
        error: null,
      }),
    }));

    const { getByTestId } = render(
      <FollowButton
        userId="user-1"
        isFollowing={false}
        onFollowChange={jest.fn()}
      />
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
}); 