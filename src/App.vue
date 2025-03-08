<template>
  <Loader v-if="!hideLoader"/>
    <!-- Modal -->
  <div v-if="!hideLoader" class="offcanvas offcanvas-bottom" :is-open="modalOpen" tabindex="-1" id="offcanvasApp" aria-labelledby="offcanvasBottomLabel">
    <div class="offcanvas-header fs-3">
      <h5 class="offcanvas-title" id="offcanvasBottomLabel">{{ modalData.header }}</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body small">
      <div>
        <img :src="modalData.body.img" alt=""  width='50' class='d-block mx-auto mb-3'>
        <span class='d-block mx-auto fs-4 text-center text' :class="'text-' + modalData.body.textStyle">{{ modalData.body.text }}</span>
        <div class="routerbtn d-flex justify-content-evenly">
          <router-link @click="redirectToLocations()" to="/locations" class="btn btn-primary mx-auto my-3">
            {{t('Locations')}}
          </router-link>
          <a @click="restartApp()"  class="btn btn-primary mx-auto my-3"> {{t('Restart')}} </a>
        </div>
      </div>
    </div>
  </div>
  <IonApp v-else>
    <IonSplitPane when="xl" content-id="main-content">
      <Menu />
      <router-view>
        <transition name="slide-left">
          <ion-router-outlet id="main-content" :animated="false"></ion-router-outlet>
        </transition>
      </router-view>
    </IonSplitPane>
  </IonApp>
</template>

<script>
import Loader from './components/Loader.vue';
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
} from '@ionic/vue';

import {
  defineComponent, ref, onMounted, onBeforeMount,
} from 'vue';
import useToast from './composition/useToast';
import Menu from './components/Menu.vue';
import { startApp, getTargetStartPage } from './composition/startApp';
import { useRouter } from 'vue-router';
import * as bootstrap from 'bootstrap';
import { useI18n } from 'vue-i18n';
import  { useStore } from 'vuex';
export default defineComponent({
  name: 'App',
  components: {
    Loader,
    IonApp,
    IonRouterOutlet,
    IonSplitPane,
    Menu,
  },
  setup() {
    const hideLoader = ref(false);
    const router = useRouter();
    const { openToast } = useToast();
    const modalData = ref({ body: { img: '', text: '', textStyle: '' } });
    const store = useStore();
    const settings = ref(store.getters["settings/settings"]);
    let offcanvas;
    
    // Add new font on arabic
    if(localStorage?.locale == "ar"){
      document.querySelector("body").style.fontFamily = "abdo-master ,bahij, serif";
    }
    onMounted(() => {
      startApp();
      console.log(settings.value);
      offcanvas = new bootstrap.Offcanvas(document.querySelector('#offcanvasApp'));
      // for ios 
      const player = document.querySelector('#lottie-container lottie-player');
      player.addEventListener('complete', () => {
      // setTimeout(() => {

      // for android
      // const player = document.querySelector('#lottie-container video');
      // player.addEventListener('ended', () => {
        // show spinner
        document.querySelector('ion-spinner').style.display = '';
        setTimeout(() => {
          // Check connection
          if (localStorage.connection == true) {
            navigator.geolocation.getCurrentPosition((pos) => { localStorage.setItem('userLocation', JSON.stringify(pos)); }, (err) => { console.log(err); }, { enableHighAccuracy: true });
            // hide Loader
            hideLoader.value = true;
            const target = getTargetStartPage();
            router.push({ name: target });
          } else {
            modalData.value.header = t('No Internet Connection');
            modalData.value.body = { img: '/assets/icons/fail.png', text: t("Internet Error"), textStyle: 'danger' };
            offcanvas.show();
          }
        }, 3000);
      });
      // },3000);
    });

    const restartApp = () => window.location.href = '/';
    const redirectToLocations = () => {
      hideLoader.value = true;
      offcanvas.hide();
    };

    const { t } = useI18n();
    return {
      hideLoader, openToast, modalData, restartApp, redirectToLocations,t
    };
  },
});
</script>
<style scoped>

  ::-webkit-scrollbar {
    display: none;
  }

  #offcanvasApp{
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
    .routerbtn a{
      background-color: #f68d41;
    border-color: #f68d41;
    padding: 12px 20px;
    border-radius: 20px;
    width: -moz-fit-content;
    width: fit-content;
    display: block;
    min-width: 40%;
    }
</style>
