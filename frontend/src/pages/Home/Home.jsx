import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import { LayoutContainer, Main } from "../../components/layout/Layout";
import { HomeContainer, TaskCard, Tag } from "./Home.styles";
import { useTodos } from "../../hooks/useTodos";
import { useState } from "react";

export default function Home() {
  const { todos, loading, addTodo, deleteTodo } = useTodos();
  const [collections] = useState([{ name: "All", count: todos.length }]);
  const [current, setCurrent] = useState("All");

  const handleAddTask = async () => {
    const title = prompt("Enter task title:");
    if (title) await addTodo(title);
  };

  return (
    <LayoutContainer>
      <Sidebar
        collections={collections}
        current={current}
        onSelect={setCurrent}
      />
      <Main>
        <Header title={current} onAdd={handleAddTask} />
        <HomeContainer>
          {loading ? (
            <p>Loading...</p>
          ) : todos.length === 0 ? (
            <p>No tasks yet.</p>
          ) : (
            todos.map((t) => (
              <TaskCard key={t.id}>
                <input
                  type="checkbox"
                  checked={t.completed}
                  readOnly
                />
                <div>
                  <h3>{t.title}</h3>
                  {t.completed && <Tag>done</Tag>}
                </div>
                <button
                  aria-label={`Delete ${t.title}`}
                  onClick={() => deleteTodo(t.id)}
                >
                  X
                </button>
              </TaskCard>
            ))
          )}
        </HomeContainer>
      </Main>
    </LayoutContainer>
  );
}
