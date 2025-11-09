import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

    const fetchTodos = async () => {
        try {
            const res = await api.get("/todos");
            const data = Array.isArray(res.data) ? res.data : res.data.data;
            setTodos(data || []);
        } catch (err) {
            console.error("Error fetching todos:", err);
            setTodos([]);
        } finally {
            setLoading(false);
        }
    };


  const addTodo = async (title) => {
    try {
      const res = await api.post("/todos", { title });
      setTodos((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error adding todo:", err);
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

  return { todos, loading, addTodo, deleteTodo };
}
