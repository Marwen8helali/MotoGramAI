import { renderHook, act } from '@testing-library/react-hooks';
import { useLikes } from '../useLikes';

describe('useLikes', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should toggle like successfully', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
      })
    );

    const { result } = renderHook(() => useLikes('post-1'));

    await act(async () => {
      const newLikeStatus = await result.current.toggleLike(false);
      expect(newLikeStatus).toBe(true);
    });

    expect(result.current.isLiking).toBe(false);
    expect(result.current.error).toBe(null);

    // Vérifier que l'appel API a été fait correctement
    expect(global.fetch).toHaveBeenCalledWith(
      'http://test-api.com/api/posts/post-1/like',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-token',
        },
      })
    );
  });

  it('should handle like error', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );

    const { result } = renderHook(() => useLikes('post-1'));

    await act(async () => {
      const newLikeStatus = await result.current.toggleLike(false);
      expect(newLikeStatus).toBe(false); // Devrait retourner le statut original en cas d'erreur
    });

    expect(result.current.isLiking).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
  });
}); 