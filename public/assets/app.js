String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};
// String.prototype.camelCase() = function() {
//   let str = this.split(' ');
//   str = str.forEach(function(s) { s.capitalize() }).join(' ');
//   // return this.split(' ').forEach((s) => s.capitalize()).join(' ');
//   return str;
// }

Vue.component('todo-list', {
  props: ['todos', 'deleter'],
  template: `
    <ul class="todo-list">
      <todo-item 
        v-for="(todo, index) in todos" 
        :key="index"
        v-bind:description="todo.description"
        v-bind:status="todo.status" 
        v-bind:deleter="deleter"
      />
    </ul>
  `
});

Vue.component('todo-item', {
  props: ['description', 'status', 'deleter'],
  methods: {
    handleDelete: function(event) {
      this.deleter(this.$vnode.key);
    }
  },
  template: `
    <li class="todo-list-item">
      <div>{{ description }}</div>
      <i @click="handleDelete" class="fab fa-algolia fa-2x"></i>
    </li>
  `
});

Vue.component('add-todo', {
  props: ['handler'],
  data: function() {
    return {
      text: ''
    };
  },
  methods: {
    handleClick: function(event) {
      event.preventDefault();
      this.handler(this.text);
    },
    handleKeyUp: function(event) {
      event.preventDefault();
      if (event.keyCode == 13) {
        this.handler(this.text);
        this.text = '';
      }
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
        @keyup="handleKeyUp"
      >
      <button class="btn btn-add" @click="handleClick">add</button>
    </div>
  `
});

const app = new Vue({
  el: '#app',
  data: {
    title: 'Vuetodo App',
    another: '',
    todos: []
  },
  mounted() {
    const data = localStorage.getItem('vuetodo');
    if (data) {
      const parsed = JSON.parse(data);
      this.todos = [...parsed];
    }
  },
  methods: {
    addtodo: function(text) {
      if (text !== undefined && text.length > 0) {
        this.todos.push({
          description: text.camelCase(),
          status: 'pending'
        });
        this.save();
      }
    },
    save: function() {
      if (this.todos.length > 0) {
        const json = JSON.stringify(this.todos);
        localStorage.setItem('vuetodo', json);
      }
    },
    deleter: function(index) {
      this.todos.splice(index, 1);
      this.save();
    }
  }
});
