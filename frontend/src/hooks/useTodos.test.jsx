import { act, renderHook, waitFor } from '@testing-library/react';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockApi = vi.mocked(api);
let useTodos;

describe('useTodos hook', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    ({ useTodos } = await vi.importActual('./useTodos.js'));
  });

  test('fetches todos on mount when API returns an array', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: [{ id: 1, title: 'Existing', completed: false }],
    });

    const { result } = renderHook(() => useTodos());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('Existing');
  });

  test('normalizes payload when API wraps data property', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: { data: [{ id: 10, title: 'Nested', completed: true }] },
    });

    const { result } = renderHook(() => useTodos());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.todos[0]).toMatchObject({ id: 10, completed: true });
  });

  test('addTodo appends new todos', async () => {
    mockApi.get.mockResolvedValueOnce({ data: [] });
    mockApi.post.mockResolvedValueOnce({
      data: { id: 2, title: 'New todo', completed: false },
    });

    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addTodo('New todo');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('New todo');
  });

  test('deleteTodo removes the todo from state', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: [
        { id: 3, title: 'Delete me', completed: false },
        { id: 4, title: 'Keep me', completed: false },
      ],
    });
    mockApi.delete.mockResolvedValueOnce({});

    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.deleteTodo(3);
    });

    expect(result.current.todos).toEqual([
      { id: 4, title: 'Keep me', completed: false },
    ]);
  });

  test('handles fetch errors by resetting todos', async () => {
    mockApi.get.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useTodos());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.todos).toEqual([]);
  });
});
