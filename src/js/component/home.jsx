import React, { useState, useEffect } from "react";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getTasks();
  }, []);

  // Sincronizando API
  async function getTasks() {
    try {
      const response = await fetch("https://playground.4geeks.com/todo/users/EIAHRJAY");
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setTodos(data.todos);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  }

  // Adicionar tarefas
  async function addTodos() {
    try {
      const newTodo = { label: inputValue, is_done: false };
      const response = await fetch("https://playground.4geeks.com/todo/todos/EIAHRJAY", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newTodo)
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Added todo:', data);  // Depuración

      if (data && data.id) {
        setTodos([...todos, data]);
        setInputValue("");
        await updateTodos(data.id, inputValue); // Actualiza el nuevo todo
      } else {
        throw new Error("Invalid todo object returned from API");
      }
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  }

  // DELETE tarea
  async function deleteTodo(id) {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  }

  // ACTUALIZAR DATOS
  async function updateTodos(id, updatedLabel) {
    try {
      const updatedTodo = { label: updatedLabel, is_done: true }; // Actualizamos a is_done
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedTodo),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setTodos(todos.map(todo => (todo.id === id ? data : todo)));
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  }

  return (
    <div className="container">
      <h1>Todos</h1>
      <div>
        <ul>
          <li>
            <input
              type="text"
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue}
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputValue.trim() !== "") {
                  addTodos();
                }
              }}
              placeholder="What do you need to do ?"
            />
          </li>
          {todos.map((item) => (
            <li key={item.id}>
              {item && item.label}
              <button className="hover-button" onClick={() => deleteTodo(item.id)}> X </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="take">{todos.length} tasks</div>
    </div>
  );
};

export default Home;
