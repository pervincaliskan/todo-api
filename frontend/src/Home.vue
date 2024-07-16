<script>
import { toast } from 'vue3-toastify';

export default {
  data() {
    return {
      todos: [],
      loading: true,
      error: null,
      inputBox: "",
      token: localStorage.getItem("token"),
      user: {},
    };
  },
  created() {
    this.fetchTasks().then(() => {
      this.fetchUser();
    });
  },
  methods: {
    async fetchUser() {
      this.loading = true;
      this.error = null;
      if (this.token) {
        await fetch("http://localhost:3000/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          credentials: 'include'
        }).then(async (response) => {
          const json = await response.json();

          if (response.status === 200) {
            this.user = json.result;
          } else {
            throw new Error(json.message);
          }
        }).catch((error) => {
          toast.error(error.message);
          console.log('Error when fetch user', error);
        })
        .finally(() => {
          this.loading = false;
        });
      }
    },
    fetchTasks() {
      this.loading = true;
      this.error = null;
      this.todos = [];
      return fetch("http://localhost:3000/todos/")
        .then((response) => response.json())
        .then((data) => {
          this.todos = data.result;
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async addTask() {
      if (this.inputBox === "") {
        //Eğer task eklemek istediğimiz ifade için input kısmı boş ise uyarı göster
        toast.error("You must write something!");
      } else {
        this.todos.push({
          _id: Date.now(),
          title: this.inputBox,
          done: false,
        });
      }
      await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: this.inputBox,
          done: false,
        }),
        credentials: 'include'
      }).then(async (response) => {
        const json = await response.json();

        if (response.status === 201 || response.status === 200) {
          console.log('Todo added successfully');
          toast.success('Todo added successfully');
        } else {
          throw new Error(json.message);
        }
      }).catch((error) => {
        toast.error(error.message);
        console.log('Error when fetch todos', error);
      });


      this.inputBox = ""; // add işleminden sonra kutunun içinin boş olmasını isteriz
      this.saveData();
    },
    saveData() {
      localStorage.setItem("tasks", JSON.stringify(this.todos));
    },
    async toggleTodoStatus(todo) {
      todo.done = !todo.done;
      await fetch(`http://localhost:3000/todos/${todo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          done: todo.done,
        }),
        credentials: 'include'
      }).then(async (response) => {
        const json = await response.json();

        if (response.status === 200) {
          console.log('Todo updated successfully');
          toast.success('Todo updated successfully');
        } else {
          toast.error(json.message);
          throw new Error(json.message);
        }
      })
    },
    async removeTodo(todo) {
      this.todos = this.todos.filter((t) => t._id !== todo._id);
      await fetch(`http://localhost:3000/todos/${todo._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include'
      }).then(async (response) => {
        const json = await response.json();

        if (response.status === 200) {
          console.log('Todo deleted successfully');
          toast.success('Todo deleted successfully');
        } else {
          toast.error(json.message);
          throw new Error(json.message);
        }
      })
    },
    logout(e) {
      e.preventDefault();
      toast.success("Logged out successfully");
      localStorage.removeItem("token");
      this.token = null;
      window.location.href = "/";
    },
  },
};
</script>

<template>
  <div class="container">
    <div class="navigation">
      <div>
        <div style="display: inline-block;" v-show="token && user?.email">
          {{
            user ? `${user.email} (${user.role})` : ""
          }}
        </div>
        <router-link v-show="!token" to="/register">Register</router-link>
        <router-link v-show="!token" to="/login">Login</router-link>
        <span v-show="token" to="/logout" @click="logout">Logout</span>
      </div>
    </div>

    <div class="todo-app">
      <h2>To-Do List <img src="./images/checklist.png" alt="" /></h2>
      <div class="row">
        <input type="text" id="input-box" placeholder="Add your text" v-model="inputBox" />
        <button @click="addTask">Add</button>
      </div>
      <ul id="list-container">
        <li v-for="todo in todos" :key="todo._id" :class="{ checked: todo.done }" @click="toggleTodoStatus(todo)">
          {{ todo.title }}
          <span @click.stop="removeTodo(todo)">{{ "\u00d7" }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
