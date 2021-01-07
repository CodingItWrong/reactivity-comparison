<template>
  <div>
    <h1>Widgets</h1>
    <form @submit.prevent="handleAddWidget">
      <input type="text" placeholder="Widget" v-model="newWidgetName" />
      <button type="submit">Add</button>
    </form>
    <ul>
      <li v-for="widget in widgets" :key="widget">{{ widget }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      widgets: [],
      newWidgetName: [],
    };
  },
  methods: {
    handleAddWidget() {
      // https://vuejs.org/v2/guide/list.html#Mutation-Methods
      // Vue wraps an observed array’s mutation methods so they will also trigger view updates.
      this.widgets.push(this.newWidgetName);
      this.newWidgetName = "";
    },
  },
};
</script>
