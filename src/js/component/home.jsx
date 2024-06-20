import React, { useState, useEffect } from 'react';

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const userName = "EIAHRJAY";
  const userApiUrl = `https://playground.4geeks.com/todo/users/${userName}`;
  const todosApiUrl = `https://playground.4geeks.com/todo/todos/${userName}`;

  // useEffect para cargar los datos iniciales al montar el componente
  useEffect(() => {
    fetch(todosApiUrl)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTodos(data);
        }
      })
      .catch(error => console.error("Error fetching todos:", error));
  }, []);

  // Función para agregar un nuevo todo
  const addTodo = () => {
    const newTodo = { label: inputValue, done: false };
    
    fetch(todosApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to create todo");
        }
        return response.json();
      })
      .then(todo => {
        setTodos([...todos, todo]);
        setInputValue("");
      })
      .catch(error => console.error("Error adding todo:", error));
  };

  // Función para eliminar un todo
  const deleteTodo = (index) => {
    const todoId = todos[index].id;
    const deleteApiUrl = `https://playground.4geeks.com/todo/todos/${todoId}`;
    
    fetch(deleteApiUrl, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to delete todo");
        }
        const updatedTodos = todos.filter((_, i) => i !== index);
        setTodos(updatedTodos);
      })
      .catch(error => console.error("Error deleting todo:", error));
  };

  // Función para eliminar todos los todos
  const clearTodos = () => {
    fetch(todosApiUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([])
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to clear todos");
        }
        setTodos([]);
      })
      .catch(error => console.error("Error clearing todos:", error));
  };

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
              onKeyPress={(e) => {
                if (e.key === "Enter" && inputValue.trim() !== "") {
                  addTodo();
                }
              }}
              placeholder="What do you need to do ?"
            />
          </li>
          {todos.map((item, index) => (
            <li key={index}>
              {item.label}
              <button className="hover-button" onClick={() => deleteTodo(index)}>X</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="take">{todos.length} tasks</div>
      <button onClick={clearTodos}>Clear All Todos</button>
    </div>
  );
};

export default Home;
