<template>
  <base-layout mapHeader  map>

    <Map v-if="online" />
    <Footer v-if="online" />
  </base-layout>
</template>

<script>

import { useRouter } from 'vue-router';
import { onMounted, onUpdated, ref } from 'vue';
import {
  save, arrowRedo, cloudDownload, mapOutline,
} from 'ionicons/icons';
import Map from '../../components/Map.vue';
import Footer from '../../components/Footer.vue';
import Loading from '../../components/Loading.vue';
import useToast from '../../composition/useToast';
import '../../composition/notification';
import { useI18n } from 'vue-i18n';
export default {
  name: 'Home',
  components: {
    Map,
    Footer,
    Loading,
  },
  setup() {
    const devices = localStorage.getItem('devices');
    const { openToast } = useToast();
    const online = localStorage.connection == true;
    const router = useRouter();
    const { t } = useI18n();
    const Icons = ref({
      save,
      arrowRedo,
      cloudDownload,
      mapOutline,
    });

    const redirectToLocations = () => {
      if (!online) { return router.push({ name: 'locations' }); }
    };
    
    const exitApp = () => {
      const confirm = confirm('Are you sure you want to exit?');
      if (confirm) cordova.plugins.exit();
    }
    const preventBack = () => {
      document.addEventListener("backbutton", (e) => {
        if(window.location.pathname === '/home' || window.location.pathname === '/'){
          e.preventDefault();
          exitApp();
        }
      }, false);
    }
    onMounted(() => { redirectToLocations(); preventBack(); });
    onUpdated(() => { redirectToLocations(); preventBack(); });

    if (Array.isArray(devices) && devices.length < 1) {
      openToast('Failed loading map locations', 'danger', 'bottom');
    }

    return {
      openToast,
      Icons,
      online,
      devices,
    };
  },
};
</script>
<style scoped>
ion-menu>ion-header
{
  background-color: red;
}

</style>
