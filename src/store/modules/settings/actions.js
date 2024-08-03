import axios from "axios";

export default {
  async fetchSettings({ commit }) {
    try {
      const url = `${process.env.VUE_APP_API_URL}/api/settings`;
      const response = await axios.get(url);
      const settings = response.data;
      commit('setSettings', settings);
      console.log(settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }
};
