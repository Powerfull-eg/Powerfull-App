import axios from "axios";

export default {
  async fetchNotifications({ commit }) {
    try {
      axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
      const url = process.env.VUE_APP_API_URL + "/api/operations/push-notifications";
      const response = await axios.get(url);
      const notifications = response?.data?.notifications ?? [];
      commit('setNotifications', notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  },

  async fetchNonSeenNotification({ commit }) {
    try {
      axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
      const url = process.env.VUE_APP_API_URL + "/api/operations/push-notifications-count";
      const response = await axios.get(url);
      const nonSeenCount = response?.data?.count ?? 0;
      commit('setNonSeenCount', nonSeenCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  },
};
