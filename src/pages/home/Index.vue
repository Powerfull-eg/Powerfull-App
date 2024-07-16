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
    const Icons = ref({
      save,
      arrowRedo,
      cloudDownload,
      mapOutline,
    });

    const redirectToLocations = () => {
      if (!online) { return router.push({ name: 'locations' }); }
    };

    onMounted(() => { redirectToLocations(); });
    onUpdated(() => { redirectToLocations(); });

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
