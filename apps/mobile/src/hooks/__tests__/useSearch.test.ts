import { renderHook, act } from '@testing-library/react-hooks';
import { useSearch } from '../useSearch';

describe('useSearch', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useSearch());

    expect(result.current.results).toEqual({ users: [], motorcycles: [] });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should perform search successfully', async () => {
    const mockResults = {
      users: [{ id: '1', username: 'test' }],
      motorcycles: [{ id: '1', brand: 'Honda' }],
    };

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResults),
      })
    );

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.results).toEqual(mockResults);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle search error', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.isLoading).toBe(false);
  });
}); 