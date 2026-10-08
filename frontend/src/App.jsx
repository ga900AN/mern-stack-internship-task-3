import { useEffect, useState } from "react";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);

  const API_URL = "http://localhost:5000/api/tasks";

  // Get all tasks
  const getTasks = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error getting tasks:", error);
    }
  };

  // Add or update a task
  const saveTask = async () => {
    if (!task.trim()) {
      alert("Please enter a task");
      return;
    }

    try {
      const isEditing = editId !== null;

      const response = await fetch(
        isEditing ? `${API_URL}/${editId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ task: task.trim() }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save task");
      }

      setTask("");
      setEditId(null);
      await getTasks();

      alert(isEditing ? "Task updated successfully!" : "Task added successfully!");
    } catch (error) {
      console.error("Error saving task:", error);
      alert(error.message);
    }
  };

  // Prepare a task for editing
  const editTask = (item) => {
    setTask(item.task);
    setEditId(item._id);
  };

  // Delete a task
  const deleteTask = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete task");
      }

      await getTasks();
      alert("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      alert(error.message);
    }
  };

  // Load tasks when the page opens
  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div style={styles.container}>
      <h1>My To-Do List</h1>

      <div style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={(event) => setTask(event.target.value)}
        />

        <button style={styles.saveButton} onClick={saveTask}>
          {editId ? "Update Task" : "Add Task"}
        </button>

        {editId && (
          <button
            style={styles.cancelButton}
            onClick={() => {
              setTask("");
              setEditId(null);
            }}
          >
            Cancel
          </button>
        )}
      </div>

      <h2>Tasks ({tasks.length})</h2>

      {tasks.length === 0 ? (
        <p>No tasks yet. Add your first task!</p>
      ) : (
        <ul style={styles.list}>
          {tasks.map((item) => (
            <li style={styles.listItem} key={item._id}>
              <span>{item.task}</span>

              <div>
                <button
                  style={styles.editButton}
                  onClick={() => editTask(item)}
                >
                  Edit
                </button>

                <button
                  style={styles.deleteButton}
                  onClick={() => deleteTask(item._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "650px",
    margin: "50px auto",
    padding: "25px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
  },
  form: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  input: {
    padding: "12px",
    flex: "1",
    minWidth: "180px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
  },
  saveButton: {
    padding: "12px 18px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "12px",
    backgroundColor: "#64748b",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    marginBottom: "10px",
    backgroundColor: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    textAlign: "left",
    flexWrap: "wrap",
  },
  editButton: {
    marginRight: "8px",
    padding: "8px 12px",
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "8px 12px",
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default App;
