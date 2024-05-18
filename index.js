index.js
// src/store/index.js
import Vue from 'vue';
import Vuex from 'vuex';
import { db } from '../firebase';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tasks: []
  },
  mutations: {
    setTasks(state, tasks) {
      state.tasks = tasks;
    },
    addTask(state, task) {
      state.tasks.push(task);
    },
    updateTask(state, updatedTask) {
      const index = state.tasks.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        state.tasks.splice(index, 1, updatedTask);
      }
    },
    deleteTask(state, taskId) {
      state.tasks = state.tasks.filter(task => task.id !== taskId);
    }
  },
  actions: {
    async fetchTasks({ commit }) {
      const snapshot = await db.collection('tasks').get();
      const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      commit('setTasks', tasks);
    },
    async addTask({ commit }, task) {
      const docRef = await db.collection('tasks').add(task);
      commit('addTask', { id: docRef.id, ...task });
    },
    async updateTask({ commit }, task) {
      await db.collection('tasks').doc(task.id).update(task);
      commit('updateTask', task);
    },
    async deleteTask({ commit }, taskId) {
      await db.collection('tasks').doc(taskId).delete();
      commit('deleteTask', taskId);
    }
  },
  getters: {
    filteredTasks: (state) => (status) => {
      return state.tasks.filter(task => task.status === status);
    }
  }
})