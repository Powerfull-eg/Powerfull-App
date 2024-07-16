<template>
  <base-layout :pageTitle="t('Settings')" :show-menu-button="false" loading="lazy">
    <div class="page-container d-flex flex-column justify-content-center align-items-center w-100">
      <div class="link welcome" :style="lang === 'ar' ? 'direction:rtl' : 'direction:ltr' "> {{ t('Hello') }} {{ userName }} &#128075</div>
      <router-link class="link d-flex justify-content-between" to="/profile"><span> <img src="/assets/icons/user.png"
            width="30" alt="" style="margin-right: 10px;"> {{t('settings.Profile')}} </span><ion-icon style="vertical-align: middle;"
          :icon="icons.chevronForwardOutline"></ion-icon></router-link>
      <router-link class="link d-flex justify-content-between" to="/gifts"><span> <img src="/assets/icons/gift.png"
            width="30" alt="" style="margin-right: 10px;"> {{t('settings.Gifts')}} </span><ion-icon style="vertical-align: middle;"
          :icon="icons.chevronForwardOutline"></ion-icon></router-link>
      <router-link class="link d-flex justify-content-between" to="/about"><span> <img src="/assets/icons/file.png" width="30" alt="" style="margin-right: 10px;"> {{t('About')}} </span><ion-icon style="vertical-align: middle;" :icon="icons.chevronForwardOutline"></ion-icon></router-link>
      <router-link class="link d-flex justify-content-between" to="/language"><span> <img src="/assets/icons/language.png" width="30" alt="" style="margin-right: 10px;"> {{t('settings.Language')}} </span><ion-icon style="vertical-align: middle;" :icon="icons.chevronForwardOutline"></ion-icon></router-link>
      <router-link class="link d-flex justify-content-between" to="/terms-conditions"><span> <img
            src="/assets/icons/file-2.png" width="30" alt="" style="margin-right: 10px;"> {{t('settings.Terms and Conditions')}}
        </span><ion-icon style="vertical-align: middle;" :icon="icons.chevronForwardOutline"></ion-icon></router-link>
      <a class="link d-flex justify-content-between" @click.prevent="deleteAccount"><span> <img src="/assets/icons/trash.png" width="30" alt="" style="margin-right: 10px;"> {{t('settings.Delete Account')}} </span><ion-icon style="vertical-align: middle;" :icon="icons.chevronForwardOutline"></ion-icon></a>
      <router-link class="link d-flex justify-content-between" to="/logout"><span> <img src="/assets/icons/exit.png"
            width="30" alt="" style="margin-right: 10px;"> {{t('settings.Sign Out')}} </span><ion-icon style="vertical-align: middle;"
          :icon="icons.chevronForwardOutline"></ion-icon></router-link>
    </div>
  </base-layout>
</template>

<script>
import { IonIcon } from '@ionic/vue';
import {
  addCircleOutline, chevronForwardOutline, cardOutline, trashOutline, giftOutline
} from 'ionicons/icons';
import { useI18n } from 'vue-i18n';

export default {
  name: 'Settings',
  components: { IonIcon },
  setup() {
    const {t} = useI18n();
    const lang = localStorage.locale
    const icons = {
      addCircleOutline, chevronForwardOutline, cardOutline, trashOutline, giftOutline
    };
    const userName = JSON.parse(localStorage.userData).first_name;
    const deleteAccount = () => {
      let options;
      if(cordova.platformId === 'ios'){
        options = 'location=yes,clearcache=yes,clearsessioncache=yes,hideurlbar=yes,hardwareback=no,hidenavigationbuttons=yes,toolbarposition=top,presentationstyle=formsheet';
      }else{
        options = 'location=yes,zoom=no,fullscreen=no,clearcache=yes,clearsessioncache=yes,hideurlbar=yes,hardwareback=no,hidenavigationbuttons=yes';
      }
      window.open = cordova.InAppBrowser.open;
      const link = "https://www.powerfull-eg.com/account-delete";
      const inAppBrowserRef = cordova.InAppBrowser.open(link, '_blank', options);
    }
    return { icons, userName, t, lang, deleteAccount };
  },
};
</script>

<style scoped>
.page-container {
  width: 75%;
  text-align: center;
  margin: 3rem auto;
}

.link {
  text-align: center;
  border: 2px solid var(--color);
  padding: 1rem;
  margin: 1.5rem 0;
  border-radius: 30px;
  width: 100%;
  display: block;
  color: unset;
  text-decoration: unset;
  font-size: 1.2rem;
  font-weight: 500;
  align-items: center;
  background: var(--color);
  color: black;
  width: 70%;
}

.welcome {
  text-align: start;
  margin: 20px 0;
  min-height: 70px;
}
</style>
