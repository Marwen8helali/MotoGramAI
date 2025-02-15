import { renderHook, act } from '@testing-library/react-hooks';
import { useComments } from '../useComments';

describe('useComments', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should fetch comments successfully', async () => {
    const mockComments = [
      { id: '1', content: 'Great bike!', user: { username: 'user1' } },
      { id: '2', content: 'Nice photo!', user: { username: 'user2' } },
    ];

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockComments),
      })
    );

    const { result, waitForNextUpdate } = renderHook(() => useComments('post-1'));

    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();

    expect(result.current.comments).toEqual(mockComments);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should add comment successfully', async () => {
    const newComment = {
      id: '3',
      content: 'New comment',
      user: { username: 'user3' },
    };

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(newComment),
      })
    );

    const { result } = renderHook(() => useComments('post-1'));

    await act(async () => {
      await result.current.addComment('New comment');
    });

    expect(result.current.comments).toContainEqual(newComment);
  });
}); 