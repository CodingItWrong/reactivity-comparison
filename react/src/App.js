import {useState} from 'react';
import './App.css';

function App() {
  const [newTodoName, setNewTodoName] = useState('');
  const [todos, setTodos] = useState([]);

  const handleAddTodo = e => {
    e.preventDefault();

    const todo = { name: newTodoName, complete: false };

    // React docs don't actually even give an example of an array `useState` value???
    setTodos([...todos, todo]);
    setNewTodoName('');
  }

  const toggleComplete = index => {
    const todo = todos[index];
    const updatedTodo = { ...todo, complete: !todo.complete };
    setTodos([
      ...todos.slice(0, index),
      updatedTodo,
      ...todos.slice(index + 1),
    ]);
  }

  return (
    <div>
      <h1>Todos</h1>
      <form onSubmit={handleAddTodo}>
        <input type="text" placeholder="Todo" value={newTodoName} onChange={e => setNewTodoName(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo, index) => (
          <li>
            {todo.name}
            -
            {todo.complete ? 'Complete' : 'Incomplete'}
            -
            <button onClick={() => toggleComplete(index)}>
              Toggle
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
