import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';

import Home from './Home';
import { theme } from '../../components/styled/theme';
import { useTodos } from '../../hooks/useTodos';

vi.mock('../../hooks/useTodos', () => ({
  useTodos: vi.fn(),
}));

const renderHome = () =>
  render(
    <ThemeProvider theme={theme}>
      <Home />
    </ThemeProvider>,
  );

const mockUseTodos = vi.mocked(useTodos);

describe('Home page', () => {
  afterEach(() => {
    vi.clearAllMocks();
    mockUseTodos.mockReset();
  });

  test('shows loading indicator', () => {
    mockUseTodos.mockReturnValue({
      todos: [],
      loading: true,
      addTodo: vi.fn(),
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
    });

    renderHome();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders empty state message', () => {
    mockUseTodos.mockReturnValue({
      todos: [],
      loading: false,
      addTodo: vi.fn(),
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
    });

    renderHome();

    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  test('renders tasks list and calls delete handler', async () => {
    const deleteTodo = vi.fn();
    const updateTodo = vi.fn();
    mockUseTodos.mockReturnValue({
      todos: [
        { id: 1, title: 'First', body: 'one', completed: false },
        { id: 2, title: 'Second', body: 'two', completed: true },
      ],
      loading: false,
      addTodo: vi.fn(),
      updateTodo,
      deleteTodo,
    });

    renderHome();

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText(/done/i)).toBeInTheDocument();

    const deleteButton = screen.getByRole('button', { name: /delete first/i });
    const user = userEvent.setup();
    await user.click(deleteButton);
    expect(deleteTodo).toHaveBeenCalledWith(1);

    const toggle = screen.getByTestId('complete-toggle-1');
    await user.click(toggle);
    expect(updateTodo).toHaveBeenCalledWith(1, { completed: true });
  });

  test('allows toggling the creation form and submitting a new task', async () => {
    const addTodo = vi.fn().mockResolvedValue({ id: 10 });
    mockUseTodos.mockReturnValue({
      todos: [],
      loading: false,
      addTodo,
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
    });

    renderHome();

    const user = userEvent.setup();
    const actionButton = screen.getByRole('button', { name: /add task/i });
    await user.click(actionButton);
    expect(
      screen.getByTestId('create-task-form'),
    ).toBeInTheDocument();

    const titleInput = screen.getByTestId('create-task-title');
    const bodyInput = screen.getByTestId('create-task-body');
    const submitButton = screen.getByTestId('create-task-submit');

    expect(submitButton).toBeDisabled();

    await user.type(titleInput, '   Nuevo título   ');
    await user.type(bodyInput, '  cuerpo ');
    expect(submitButton).not.toBeDisabled();

    await user.click(submitButton);
    expect(addTodo).toHaveBeenCalledWith({
      title: 'Nuevo título',
      body: 'cuerpo',
    });
    expect(screen.queryByTestId('create-task-form')).not.toBeInTheDocument();
  });

  test('supports editing an existing task and cancelling the form', async () => {
    const updateTodo = vi.fn().mockResolvedValue({});
    mockUseTodos.mockReturnValue({
      todos: [
        { id: 3, title: 'Edit me', body: 'Existing body', completed: false },
      ],
      loading: false,
      addTodo: vi.fn(),
      updateTodo,
      deleteTodo: vi.fn(),
    });

    renderHome();
    const user = userEvent.setup();

    await user.click(screen.getByTestId('edit-button-3'));
    const titleInput = screen.getByTestId('edit-task-title-3');
    const bodyInput = screen.getByTestId('edit-task-body-3');

    await user.clear(titleInput);
    await user.type(titleInput, '  Edited title  ');
    await user.clear(bodyInput);
    await user.type(bodyInput, 'Edited body');

    await user.click(screen.getByTestId('edit-task-save-3'));

    expect(updateTodo).toHaveBeenCalledWith(3, {
      title: 'Edited title',
      body: 'Edited body',
      completed: false,
    });

    // Re-open and cancel to cover cancel path
    await user.click(screen.getByTestId('edit-button-3'));
    await user.click(screen.getByTestId('edit-task-cancel-3'));
    expect(
      screen.queryByTestId('edit-form-3'),
    ).not.toBeInTheDocument();
  });
});
