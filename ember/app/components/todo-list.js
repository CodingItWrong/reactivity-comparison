import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class TodoListComponent extends Component {
  @tracked newTodoName = '';
  @tracked todos = [];

  @action
  handleAddTodo(e) {
    e.preventDefault();

    const todo = { name: this.newTodoName, complete: false };

    // https://guides.emberjs.com/release/upgrading/current-edition/tracked-properties/#toc_arrays
    // Arrays are another example of a type of object where you can't enumerate every possible value - after all, there are an infinite number of integers (though you may run out of bits in your computer at some point!). Instead, you can continue to use EmberArray, which will continue to work with tracking and will cause any dependencies that use it to invalidate correctly.
    // doesn't work:
    // this.todos.push(this.newTodoName);

    // works:
    this.todos = [...this.todos, todo];

    this.newTodoName = '';
  }

  @action
  toggleComplete(index) {
    const todo = this.todos[index];

    // doesn't work
    // todo.complete = !todo.complete;

    // necessary
    const updatedTodo = { ...todo, complete: !todo.complete };
    this.todos = [
      ...this.todos.slice(0, index),
      updatedTodo,
      ...this.todos.slice(index + 1),
    ];
  }
}
