import axios from "axios";

export default {
  async fetchSettings({ commit }) {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/settings');
      const settings = response.data;
      commit('setSettings', settings);
      console.log(settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }
};
