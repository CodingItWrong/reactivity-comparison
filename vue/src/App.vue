<template>
  <div>
    <h1>Todos</h1>
    <form @submit.prevent="handleAddTodo">
      <input type="text" placeholder="Todo" v-model="newTodoName" />
      <button type="submit">Add</button>
    </form>
    <ul>
      <li v-for="todo in todos" :key="todo">
        {{ todo.name }}
        -
        <span v-if="todo.complete"> Complete </span>
        <span v-else> Incomplete </span>
        -
        <button @click="toggleComplete(todo)">Toggle</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      todos: [],
      newTodoName: [],
    };
  },
  methods: {
    handleAddTodo() {
      const todo = { name: this.newTodoName, complete: false };

      // https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
      // Change detection caveats in Vue 2: property addition or deletion, setting item by index

      // https://vuejs.org/v2/guide/list.html#Mutation-Methods
      // Vue wraps an observed array’s mutation methods so they will also trigger view updates.
      this.todos.push(todo);
      this.newTodoName = "";
    },
    toggleComplete(todo) {
      todo.complete = !todo.complete;
    },
  },
};
</script>
