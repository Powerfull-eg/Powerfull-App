import { Storage } from '@capacitor/storage';
import api from '../../../api';

async function setToken(token) {
  await Storage.set({
    key: 'token',
    value: token,
  });
}

async function setUserData(userData) {
  await Storage.set({
    key: 'user',
    value: JSON.stringify({
      userId: userData.id,
      userType: userData.typeUser,
      userName: userData.userName,
    }),
  });
}

export default {
  register({}, userData) {
    return api.post('/register', userData)
      .then(async (response) => {
        return response.data;
      })
      .catch((error) => error.response);
  },
};
