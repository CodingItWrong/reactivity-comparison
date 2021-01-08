# Reactivity Comparison

This compares my experience as a user of the reactivity models in Ember Octane, MobX, React, and Vue. In summary:

- React has a very simple rule: "don't mutate." This can lead to complex code, but at least it isn't edgecasey.
- MobX and Vue have similar edge cases: "mutation APIs work, except when they don't." You can use normal APIs most of the time, but have to keep in mind when they will fail.
- Ember Octane's @tracked properties in classes are less edgecasey than MobX and Vue, but there are decision points to be made around using JS primitives vs class instances with @tracked properties.

As a result, although I don't prefer React's approach for many reasons, there is a straightforwardness to it that makes it easy to work with.

## [React](./react)

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

To add a record you call .push(), which the observed array wraps. To update a record you assign to its property.

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

If you're storing data in components you're at least going to have tracked properties at that point. So you have a choice: store all your data in class instances with tracked properties, or use JS primitives with immutability.

The class instance approach:

```js
class Todo {
  @tracked name;
  @tracked complete = false;

  constructor(name) {
    this.name = name;
  }
}

@action
handleAddTodo() {
  const todo = new Todo(this.newTodoName);

  // .push() doesn't work, would need an EmberArray or something
  this.todos = [...this.todos, todo];
}

@action
toggleComplete(index) {
  const todo = this.todos[index];
  todo.complete = !todo.complete;
}
```

The primitives/immutability approach:

```js
@action
handleAddTodo() {
  const todo = { name: this.newTodoName, complete: false };
  this.todos = [...this.todos, todo];
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

(Ember Data throws another curveball because it's on the old reactivity model, you *can* mutate its properties, but you need the @computed decorator. That consideration can lie outside the scope of this convo.)
