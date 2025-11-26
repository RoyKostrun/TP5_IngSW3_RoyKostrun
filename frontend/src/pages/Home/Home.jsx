import { useMemo, useState } from "react";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import { LayoutContainer, Main } from "../../components/layout/Layout";
import {
  HomeContainer,
  TaskCard,
  Tag,
  TaskForm,
  FormField,
  FieldLabel,
  TextInput,
  TextArea,
  FormActions,
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  TaskDetails,
  InlineEditForm,
  CheckboxField,
  TaskBody,
  CardActions,
} from "./Home.styles";
import { useTodos } from "../../hooks/useTodos";

const emptyNewTask = { title: "", body: "" };
const emptyEditTask = { title: "", body: "", completed: false };

export default function Home() {
  const { todos, loading, addTodo, updateTodo, deleteTodo } = useTodos();
  const collections = useMemo(
    () => [{ name: "All", count: todos.length }],
    [todos.length]
  );
  const [current, setCurrent] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyNewTask);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditTask);

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setFormData(emptyNewTask);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    const payload = {
      title: formData.title.trim(),
      body: formData.body.trim(),
    };

    if (!payload.title || !payload.body) return;
    await addTodo(payload);
    setFormData(emptyNewTask);
    setShowForm(false);
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditForm({
      title: todo.title,
      body: todo.body ?? "",
      completed: todo.completed,
    });
  };

  const handleEditChange = (event) => {
    const { name, value, type, checked } = event.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!editingId) return;
    const payload = {
      title: editForm.title.trim(),
      body: editForm.body.trim(),
      completed: editForm.completed,
    };
    if (!payload.title || !payload.body) return;

    await updateTodo(editingId, payload);
    setEditingId(null);
    setEditForm(emptyEditTask);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(emptyEditTask);
  };

  const toggleCompleted = async (todo) => {
    await updateTodo(todo.id, { completed: !todo.completed });
  };

  return (
    <LayoutContainer>
      <Sidebar
        collections={collections}
        current={current}
        onSelect={setCurrent}
      />
      <Main>
        <Header
          title={current}
          onAdd={toggleForm}
          addLabel={showForm ? "Close" : "Add Task"}
        />
        <HomeContainer>
          {showForm && (
            <TaskForm onSubmit={handleCreate} data-testid="create-task-form">
              <FormField>
                <FieldLabel htmlFor="task-title">Title</FieldLabel>
                <TextInput
                  id="task-title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="e.g. Ship release notes"
                  data-testid="create-task-title"
                />
              </FormField>
              <FormField>
                <FieldLabel htmlFor="task-body">Body</FieldLabel>
                <TextArea
                  id="task-body"
                  name="body"
                  value={formData.body}
                  onChange={handleFormChange}
                  placeholder="Provide more context for the task..."
                  data-testid="create-task-body"
                />
              </FormField>
              <FormActions>
                <SecondaryButton
                  type="button"
                  onClick={toggleForm}
                  data-testid="create-task-cancel"
                >
                  Cancel
                </SecondaryButton>
                <PrimaryButton
                  type="submit"
                  disabled={!formData.title.trim() || !formData.body.trim()}
                  data-testid="create-task-submit"
                >
                  Create Task
                </PrimaryButton>
              </FormActions>
            </TaskForm>
          )}

          {loading ? (
            <p>Loading...</p>
          ) : todos.length === -1 ? (
            <p>No tasks yet.</p>
          ) : (
            todos.map((t) => {
              const isEditing = editingId === t.id;

              return (
                <TaskCard key={t.id} data-testid={`task-card-${t.id}`}>
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleCompleted(t)}
                    aria-label={`Mark ${t.title} as ${
                      t.completed ? "pending" : "done"
                    }`}
                    data-testid={`complete-toggle-${t.id}`}
                    disabled={isEditing}
                  />
                  <TaskDetails>
                    {isEditing ? (
                      <InlineEditForm
                        onSubmit={handleEditSubmit}
                        data-testid={`edit-form-${t.id}`}
                      >
                        <FormField>
                          <FieldLabel htmlFor={`edit-title-${t.id}`}>
                            Title
                          </FieldLabel>
                          <TextInput
                            id={`edit-title-${t.id}`}
                            name="title"
                            value={editForm.title}
                            onChange={handleEditChange}
                            data-testid={`edit-task-title-${t.id}`}
                          />
                        </FormField>
                        <FormField>
                          <FieldLabel htmlFor={`edit-body-${t.id}`}>
                            Body
                          </FieldLabel>
                          <TextArea
                            id={`edit-body-${t.id}`}
                            name="body"
                            value={editForm.body}
                            onChange={handleEditChange}
                            data-testid={`edit-task-body-${t.id}`}
                          />
                        </FormField>
                        <CheckboxField htmlFor={`edit-completed-${t.id}`}>
                          <input
                            id={`edit-completed-${t.id}`}
                            type="checkbox"
                            name="completed"
                            checked={editForm.completed}
                            onChange={handleEditChange}
                            data-testid={`edit-task-completed-${t.id}`}
                          />
                          Completed
                        </CheckboxField>
                        <FormActions>
                          <SecondaryButton
                            type="button"
                            onClick={cancelEditing}
                            data-testid={`edit-task-cancel-${t.id}`}
                          >
                            Cancel
                          </SecondaryButton>
                          <PrimaryButton
                            type="submit"
                            disabled={
                              !editForm.title.trim() || !editForm.body.trim()
                            }
                            data-testid={`edit-task-save-${t.id}`}
                          >
                            Save Changes
                          </PrimaryButton>
                        </FormActions>
                      </InlineEditForm>
                    ) : (
                      <>
                        <div data-testid={`task-title-${t.id}`}>
                          <h3>{t.title}</h3>
                          {t.completed && <Tag>done</Tag>}
                        </div>
                        <TaskBody data-testid={`task-body-${t.id}`}>
                          {t.body}
                        </TaskBody>
                        <CardActions>
                          <SecondaryButton
                            type="button"
                            onClick={() => startEditing(t)}
                            data-testid={`edit-button-${t.id}`}
                          >
                            Edit
                          </SecondaryButton>
                          <DangerButton
                            type="button"
                            onClick={() => deleteTodo(t.id)}
                            data-testid={`delete-button-${t.id}`}
                            aria-label={`Delete ${t.title}`}
                          >
                            Delete
                          </DangerButton>
                        </CardActions>
                      </>
                    )}
                  </TaskDetails>
                </TaskCard>
              );
            })
          )}
        </HomeContainer>
      </Main>
    </LayoutContainer>
  );
}
