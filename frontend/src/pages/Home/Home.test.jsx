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
      deleteTodo: vi.fn(),
    });

    renderHome();

    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  test('renders tasks list and calls delete handler', async () => {
    const deleteTodo = vi.fn();
    mockUseTodos.mockReturnValue({
      todos: [
        { id: 1, title: 'First', completed: false },
        { id: 2, title: 'Second', completed: true },
      ],
      loading: false,
      addTodo: vi.fn(),
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
  });
});
