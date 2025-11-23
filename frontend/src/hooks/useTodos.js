import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalizeTodos = (data = []) =>
    (data || []).map((todo) => ({
      ...todo,
      body: todo.body ?? "",
    }));

  const fetchTodos = async () => {
    try {
      const res = await api.get("/todos");
      const data = Array.isArray(res.data) ? res.data : res.data.data;
      setTodos(normalizeTodos(data));
    } catch (err) {
      console.error("Error fetching todos:", err);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async ({ title, body }) => {
    try {
      const payload = { title, body: body ?? "" };
      const res = await api.post("/todos", payload);
      setTodos((prev) => [...prev, { ...res.data, body: res.data.body ?? "" }]);
      return res.data;
    } catch (err) {
      console.error("Error adding todo:", err);
      return null;
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      const res = await api.put(`/todos/${id}`, updates);
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...res.data, body: res.data.body ?? "" } : todo
        )
      );
      return res.data;
    } catch (err) {
      console.error("Error updating todo:", err);
      return null;
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return { todos, loading, addTodo, updateTodo, deleteTodo };
}
