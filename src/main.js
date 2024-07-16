import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { Storage } from '@capacitor/storage';
import mitt from 'mitt';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { createI18n } from 'vue-i18n';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import bootstrap from 'bootstrap';
import App from './App.vue';
import router from './router';
import store from './store';
import Utils from './utils/index';

import redirectToHome from './composition/redirectToHome';

import BaseLayout from './components/base/BaseLayout.vue';
import ErrorMessage from './components/ErrorMessage.vue';
import Loading from './components/Loading.vue';

/* import the fontawesome core */

/* import font awesome icon component */

/* import specific icons */

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/index.css';
// Boottstrap
import 'bootstrap/dist/css/bootstrap.css';

/* Bootstrap utilities */
import './assets/css/bootstrap-grid.min.css';

/* add icons to the library */
library.add(faUserSecret);

// Add localization
import en from './lang/en';
import ar from './lang/ar';

const messages = {
  en: en,
  ar: ar
}
let lang;
if (!localStorage.getItem("oldGuest")) {
    // navigator.globalization.getPreferredLanguage((l) => lang = (l.value.startsWith('ar') ? 'ar': 'en') );
}else{
  lang = (localStorage.getItem("locale") ? localStorage.getItem("locale") : "en");
}
localStorage.setItem("locale",(lang == "en" ?  "en" : "ar"));
const i18n = createI18n({
  locale: localStorage.locale,
  fallbackLocale: "en",
  messages,
  legacy:false
});

router.beforeEach(async (to, from, next) => {
  const user = await Storage.get({ key: 'user' });
  let lUserId = 0;
  let lUserType = 0;

  if (user.value) {
    const { userId, userType } = JSON.parse(user.value);
    lUserId = userId;
    lUserType = userType;
  }

  if (['login', 'home', 'register'].includes(to.name) && user.value) {
    next({ name: redirectToHome().routes[lUserType] });
    return;
  }

  if (!to.meta.userType) {
    next();
    return;
  }

  if (!user.value) {
    next({ name: 'logout' });
    return;
  }

  if (!lUserId || !lUserType) {
    next({ name: 'logout' });
    return;
  }

  to.matched.some((route) => {
    if (typeof route.meta.userType === 'object') {
      if (!route.meta.userType.some((type) => type === lUserType)) {
        next({ name: 'not-authorized' });
        return;
      }
    }

    if (!route.meta.userType === lUserType) {
      next({ name: 'not-authorized' });
      return;
    }

    next();
  });
});

const app = createApp(App)
  .provide('store', store)
  .use(i18n)
  .use(IonicVue)
  .use(router)
  .use(store)
  .use(bootstrap);
app.config.globalProperties.emitter = mitt();
app.config.globalProperties.$validate = Utils.validations;

app.component('base-layout', BaseLayout);
app.component('error-message', ErrorMessage);
app.component('loading', Loading);
app.component('font-awesome-icon', FontAwesomeIcon);
router.isReady()
  .then(() => {
    app.mount('#app');
  })
  .then(() => defineCustomElements(window));
