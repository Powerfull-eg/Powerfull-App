import { createStore } from 'vuex';

import general from './modules/general/index';
import login from './modules/login/index';
import register from './modules/register/index';
import files from './modules/files/index';
import user from './modules/user/index';
import menu from './modules/menu/index';
import map from './modules/map/index';

const store = createStore({
  modules: {
    general,
    login,
    files,
    user,
    menu,
    map,
  },
});

export default store;
