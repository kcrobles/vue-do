String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

Vue.component("todo-list", {
  props: ["todos"],
  template: `
    <ul class="todo-list">
      <todo-item 
        v-for="(todo, index) in todos" 
        :key="index"
        v-bind:description="todo.description"
        v-bind:status="todo.status"
      />
    </ul>
  `
});

Vue.component("todo-item", {
  props: ["description", "status"],
  template: `
    <li class="todo-list-item">
      <div>{{ description }}</div>
      <i class="fab fa-algolia fa-2x"></i>
    </li>
  `
});

Vue.component("add-todo", {
  props: ["handler"],
  data: function() {
    return {
      text: ""
    }
  },
  methods: {
    handleClick: function(event) {
      event.preventDefault();
      this.handler(this.text);
    }
  },
  template: `
    <div class="entry">
      <input
        type="text" 
        name="todoin" 
        id="todoin" 
        placeholder="Enter a todo" 
        v-model="text"
      >
      <button class="btn btn-add" @click="handleClick">add</button>
    </div>
  `
});

const app = new Vue({
  el: "#app",
  data: {
    title: "Vuetodo App",
    another: "",
    todos: [
      {
        description: "Wake up",
        status: "PENDING"
      },
      {
        description: "Get dressed",
        status: "PENDING"
      },
      {
        description: "Eat breakfast",
        status: "PENDING"
      }
    ]
  },
  methods: {
    addtodo: function(text) {
      if (text !== undefined && text.length > 0) {
        this.todos.push({
          description: text.capitalize(),
          status: "PENDING"
        });
      }
    }
  }
});
