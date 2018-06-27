String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};
const COMPLETED = "completed";
const PENDING = "pending";

Vue.component('todo-list', {
  props: ['todos', 'deleter', 'statuschange'],
  template: `
    <ul class="todo-list" v-if="todos.length > 0">
      <todo-item 
        v-for="(todo, index) in todos" 
        :key="index"
        v-bind:description="todo.description"
        v-bind:status="todo.status" 
        v-bind:deleter="deleter"
        v-bind:onstatuschange="statuschange"
      />
    </ul>
  `
});

Vue.component('todo-item', {
  props: ['description', 'status', 'deleter', 'onstatuschange'],
  methods: {
    handleDelete: function(event) {
      this.deleter(this.$vnode.key);
    },
    handleStatus: function(event) {
      this.onstatuschange(this.$vnode.key);
    }
  },
  template: `
    <li v-if="status" :class="['todo-list-item', status]">
      <div>
        <i @click="handleStatus" :class="['far', status === 'pending' ? 'fa-circle' : 'fa-check-circle']">
        </i><span>{{ description }}</span></div>
      <i @click="handleDelete" class="fas fa-times hide-hover"></i>
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

Vue.component('filter-selector', {
  props: ['filters', 'filterchange'],
  methods: {
    handleClick: function(index) {
      this.filterchange(index);
    }
  },
  template: `
    <div class="filter-selector-box">
      <div 
        v-for="(filter, index) in filters" 
        :class="['filter-item', filter.selected ? 'active' : '']" 
        :key="index" 
        @click="handleClick(index)"
      >{{ filter.name }}</div>
    </div>
  `
});

const app = new Vue({
  el: '#app',
  data: {
    title: 'Todo Vue',
    another: '',
    todos: [],
    filters: [
      { name: 'all', selected: true },
      { name: 'pending', selected: false },
      { name: 'completed', selected: false }
    ]
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
          description: text.capitalize(),
          status: PENDING
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
    },
    statuschange: function(index) {
      this.todos = this.todos.map((todo, idx) => {
        if(idx === index) {
          let { status } = todo;
          status = status === PENDING ? COMPLETED : PENDING;
          return {...todo, status: status};
        }
        return todo;
      });
    },
    filterchange: function(index) {
      this.filters = this.filters.map((filter, idx) => {
        if(idx === index) {
          return {...filter, selected: true };
        }
        return {...filter, selected: false };
      });
    },
    filtered: function() {
      const { name } = this.filters.filter((f) => f.selected === true)[0];
      return this.todos.filter((todo) => {
        if (name !== 'all') {
          return todo.status === name;
        } 
        return todo;                
      });
    }
  }
});
