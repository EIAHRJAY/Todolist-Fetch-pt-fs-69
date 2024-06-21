import React, {useState, useEffect} from "react";

const Home = () => {
  const [inputValue,setInputValue] = useState("");
  const [todos,setTodos] = useState([]);

useEffect(() =>{
    getTasks();
  }, []);
  //sincronizando api
async function getTasks() {
  try{
    const response = await fetch("https://playground.4geeks.com/todo/users/EHIARJAY");
    if(!response.ok){
      throw new Error(`Error : ${response.status}`);
    }
    const data = await response.json();
    setTodos(data.todos);
  }catch(error) {
    console.error("Failed to fetch tasks",error);
  }
}
// adicionar tarefas
async function addTodos(){
try{
  const newTodo = { label: inputValue};
  const response = await fetch("https://playground.4geeks.com/todo/todos/EIAHRJAY",{
    method: "POST",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify(newTodo)
  });
  if(!response.ok){
    throw new Error(`Error: ${response.status}`)
  }
  const data = await response.json();
  setTodos([...todos, data.todo]);
  setInputValue("");
}catch(error){
  console.error("Failed to add todo:", error);
}
}



  return(
    <div className="container">
      <h1>Todos </h1>
      <div>
      <ul>
        <li ><input
         type="text" 
         onChange={(e) => setInputValue(e.target.value)}
         value={inputValue}
         onKeyPress={(e) =>{
          if(e.key === "Enter" && inputValue.trim() != "") {
           addTodos();
          }
        
        }}
          placeholder="What do you need to do ?"></input></li>
        {todos.map((item,index) => (
          <li key={index}>{item && item.label}<button className="hover-button" onClick={() => 
            setTodos(
              todos.filter(
                (t, currentIndex) => 
                  index != currentIndex
              )
            )
              }>X</button>
              </li>
        ))}  
         
      </ul>
    </div>
      <div className="take">{todos.length} takes</div>
   
    </div>
  );
};

export default Home;