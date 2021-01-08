# Reactivity Comparison

## React

With React, the rule is "don't mutate." It's consistent: you always follow it, and you're safe.

To add a record you immutably create a new array. To mutate a record you immutably create a new array with a new object in it. Can be tedious when done by hand, but it's consistent.

The only sort-of caveat is "make sure you're not accidentally mutating, because JavaScript doesn't provide a lot of safety here."

```js
const [todos, setTodos] = useState([]);

const addTodo = name => {
  const todo = { name, complete: false };
  setTodos([...todos, todo]);
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
```

## Vue

With Vue, the rule is "mutation APIs work, except when they don't." There are caveats.

To add a record you call .push(), which the observed array wraps. To update a record you assign to its property. That all works fine.

But the cases where you _can't_ use normal mutation (at least in Vue 2) are: property addition or deletion, and setting item by index: <https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats>

```js
// this code example doesn't happen to run into the caveats

handleAddTodo() {
  const todo = { name: this.newTodoName, complete: false };
  this.todos.push(todo);
},
toggleComplete(todo) {
  todo.complete = !todo.complete;
},
```

## MobX

Like with Vue, the rule with MobX is "mutation APIs work, except when they don't." There are caveats.

Always use mutation, but be aware of caveats. To add a record you call .push(), which the observed array wraps. To update a record you assign to its property.

I know of at least one caveat: in React Native, using FlatList, the array is not accessed in the render function, so MobX doesn't know to track it. You have to explicitly call .slice() there. And I have seen this fail even doing this approach. <https://github.com/mobxjs/mobx/issues/1142>

```jsx
// this code example doesn't happen to run into the caveats

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
    this.todos.push(todo);
  }
}

const toggleComplete = todo => {
  todo.complete = !todo.complete;
}

<ul>
  {todoStore.todos.map(todo => (/* ... */))}
</ul>
```

## Ember Octane

With Ember Octane the rule is "assign to tracked properties, but use immutability for objects and arrays that aren't tracked."

Ember Data throws another curveball because it's on the old reactivity model, you *can* mutate its properties, but you need the @computed decorator. That consideration can lie outside the scope of this convo.

```js
@action
handleAddTodo() {
  const todo = { name: this.newTodoName, complete: false };
.
  // .push() doesn't work
  this.todos = [...this.todos, todo];

  this.newTodoName = '';
}

@action
toggleComplete(index) {
  const todo = this.todos[index];

  // doesn't work: todo.complete = !todo.complete;

  const updatedTodo = { ...todo, complete: !todo.complete };
  this.todos = [
    ...this.todos.slice(0, index),
    updatedTodo,
    ...this.todos.slice(index + 1),
  ];
}
```