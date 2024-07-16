import { Storage } from '@capacitor/storage';

export default {
  async getUserId() {
    const user = await Storage.get({ key: 'user' });

    if (!user.value) return 0;

    const { userId } = JSON.parse(user.value);

    return userId || 0;
  },
  async getUserType() {
    const user = await Storage.get({ key: 'user' });

    console.log(user);

    if (!user.value) return 0;

    const { userType } = JSON.parse(user.value);

    return userType || 0;
  },
  async getUserName() {
    const userData  = localStorage?.userData ? JSON.parse(localStorage?.userData): null;
    const userName = localStorage.token && userData ? userData.first_name +" "+ userData.last_name : '';
    return userName;
  },
};
