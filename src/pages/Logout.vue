<template>
  <base-layout :show-menu-button="false" :ignore-history="true" hideHeader hideMenuBtn map>
    <ion-img src="/assets/images/exit.png"> </ion-img>
    <span class="d-inline-block w-100 m-1 fs-5 text-center text-white fw-bolder">{{t("Account logged out successfully")}}</span>
    <ion-item class="atention" lines="none">
      <ion-label class="d-flex align-items-center justify-content-center text-white">
        <ion-text class="ion-text-uppercase mr-2">{{t('Bye')}}</ion-text>
        <ion-spinner name="dots"></ion-spinner>
      </ion-label>
    </ion-item>
  </base-layout>
</template>

<script>
import {
  IonImg, IonSpinner, IonLabel, IonItem, IonText,
} from '@ionic/vue';

import * as bootstrap from 'bootstrap';
import { useRouter } from 'vue-router';
import { mapActions } from 'vuex';
import { ref,onMounted,onUpdated } from 'vue';
import { Storage } from '@capacitor/storage';
import axios from 'axios';
import { config } from '@fortawesome/fontawesome-svg-core';
import { useI18n } from 'vue-i18n';

export default {
  name: 'Logout',
  components: {
    IonImg,
    IonSpinner,
    IonLabel,
    IonItem,
    IonText,
  },
  setup() {
    const {t} = useI18n();
    const router = useRouter();
    const timer = null;

    onUpdated(()=>{
      logout();
    });
    
    function logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.isAuth = "0"

      setTimeout( () =>{
          window.location.href = '/';
        },3000);
    }
    return {
      router,
      timer,
      image: 'assets/vectors/join.svg',
      logout,
      t
    };
  },
  methods: {
    ...mapActions('user', ['cleanUserData']),

  },
};
</script>

<style scoped>
ion-img {
  height: 80%;
}

.atention {
  color: var(--ion-color-primary);
  font-size: 20px;
  font-weight: 700;
}

#offcanvasLogout{
  --bs-offcanvas-height: 55%;
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
    border-top: 5px solid #f68d41;
    padding: 0 10px;
}
.offcanvas-header{
  padding: 20px 20px 0 0;
}
.offcanvas-body{
  padding: 0;
  padding-top: 30px;
}
</style>
