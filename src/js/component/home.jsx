import React, { useState, useEffect } from "react";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);

 
  useEffect(() => {
    initializeUserAndTasks();
  }, []);

 
 
  //INICIALIZA user y OBTENER tareas
  async function initializeUserAndTasks (){
    try{

      await getTasks();
    }catch(error){

      if(error.message === 'User not found'){
        
        await createUser();
        await getTasks();

      }else{
        console.error("Failed to initialize user and tasks:", error);
      }
    }
  }


  // OBTENER tareas
  async function getTasks() {
    try {
      const response = await fetch("https://playground.4geeks.com/todo/users/EIAHRJAY");
      if (!response.ok) {
        if(response.status === 404){
          throw new Error('User not found');
        }
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setTodos(data.todos || []); // Si la respuesta no tiene 'todos', usa un array vacío
    } catch (error) {
      console.error("Failed to fetch tasks", error);
      throw error;
    }
  }

  
  //Crear Usuario
  async function createUser() {
    try{
      const response = await fetch("https://playground.4geeks.com/todo/users/EIAHRJAY", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({ name: "EIAHRJAY" })
      });
      if(!response.ok){
        throw new Error(`Error: ${response.status}`)
      }
    }catch(error){
      console.error("Failed to create user;", error)
      throw error;
    }
  }

  
  // ADICIONAR tarefas
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
      console.log('Added todo:', data);  // Depuracao

      if (data && data.id) {
        setTodos(prevTodos => [...prevTodos, data]); // Arreglo Aqui 
        setInputValue("");
        //await updateTodos(data.id, inputValue); //el cacau esta aqui 
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
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id)); // Arreglo aqui
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  }
  
  
 
  //DELETE User
  async function deleteUser() {
    try {
      const response = await fetch("https://playground.4geeks.com/todo/users/EIAHRJAY", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      setTodos([]); // Limpiar el estado de todos después de eliminar el usuario

        await createUser();
        
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  }
  
 //RENDERIZACAO
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
      <div>
        <button className="mybutton" onClick={deleteUser}> Delete all</button>
      </div>
    </div>
  );
};

export default Home;