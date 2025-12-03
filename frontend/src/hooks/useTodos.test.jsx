import { act, renderHook, waitFor } from '@testing-library/react';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
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
      data: [{ id: 1, title: 'Existing', body: 'Existing body', completed: false }],
    });

    const { result } = renderHook(() => useTodos());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('Existing');
  });

  test('normalizes payload when API wraps data property', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: { data: [{ id: 10, title: 'Nested', body: 'Nested body', completed: true }] },
    });

    const { result } = renderHook(() => useTodos());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.todos[0]).toMatchObject({ id: 10, completed: true });
  });

  test('addTodo appends new todos', async () => {
    mockApi.get.mockResolvedValueOnce({ data: [] });
    mockApi.post.mockResolvedValueOnce({
      data: { id: 2, title: 'New todo', body: 'Details', completed: false },
    });

    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addTodo({ title: 'New todo', body: 'Details' });
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('New todo');
    expect(mockApi.post).toHaveBeenCalledWith('/todos', {
      title: 'New todo',
      body: 'Details',
    });
  });

  test('deleteTodo removes the todo from state', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: [
        { id: 3, title: 'Delete me', body: 'Body 3', completed: false },
        { id: 4, title: 'Keep me', body: 'Body 4', completed: false },
      ],
    });
    mockApi.delete.mockResolvedValueOnce({});

    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.deleteTodo(3);
    });

    expect(result.current.todos).toEqual([
      { id: 4, title: 'Keep me', body: 'Body 4', completed: false },
    ]);
  });

  test('handles fetch errors by resetting todos', async () => {
    mockApi.get.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useTodos());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.todos).toEqual([]);
  });

  test('updateTodo replaces the matching todo in state', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: [{ id: 5, title: 'Old', body: 'Old body', completed: false }],
    });
    mockApi.put.mockResolvedValueOnce({
      data: { id: 5, title: 'Updated', body: 'Updated body', completed: true },
    });

    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.updateTodo(5, { title: 'Updated' });
    });

    expect(result.current.todos[0]).toMatchObject({
      title: 'Updated',
      body: 'Updated body',
      completed: true,
    });
    expect(mockApi.put).toHaveBeenCalledWith('/todos/5', { title: 'Updated' });
  });
});
