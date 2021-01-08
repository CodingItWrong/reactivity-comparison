import { useState } from 'react';
import { makeObservable, observable, action } from "mobx";
import { observer } from "mobx-react-lite"

class TodoStore {
  todos = [];

  constructor() {
    makeObservable(this, {
      todos: observable,
      addTodo: action,
    });
  }

  addTodo(name) {
    const todo = { name, complete: false };

    // https://mobx.js.org/api.html#observablearray
    // To convert observable arrays back to plain arrays, use the .slice() method, or check out toJS to convert them recursively. Besides all the language built-in array functions, the following goodies are available on observable arrays as well:…
    this.todos.push(todo);
  }
}

const todoStore = new TodoStore();

// somehow this rerenders even if I forget observer()??
const App = observer(() => {
  const [newTodoName, setNewTodoName] = useState('');

  const handleAddTodo = e => {
    e.preventDefault();
    todoStore.addTodo(newTodoName);
    setNewTodoName('');
  }

  const toggleComplete = todo => {
    todo.complete = !todo.complete;
  }

  return (
    <div>
      <h1>Todos</h1>
      <form onSubmit={handleAddTodo}>
        <input type="text" placeholder="Todo" value={newTodoName} onChange={e => setNewTodoName(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todoStore.todos.map(todo => (
          <li>
            {todo.name}
            -
            {todo.complete ? 'Complete' : 'Incomplete'}
            -
            <button onClick={() => toggleComplete(todo)}>
              Toggle
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default App;
