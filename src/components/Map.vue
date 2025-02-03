<template>
  <MapButtons />
  <div id="map"></div>

  <!-- Modal -->
    <div class="offcanvas offcanvas-bottom" :is-open="modalOpen" tabindex="-1" id="offcanvasMap" aria-labelledby="offcanvasBottomLabel">
      <ShopData :modalData="modalData" :openScanner="openScanner"/>
  </div>
</template>

<!-- init map  -->
<script>
import { navigateCircleSharp } from 'ionicons/icons';
import ShopData from './ShopData.vue';
import * as bootstrap from 'bootstrap';
import {
  IonButtons, IonButton, IonModal, IonHeader, IonToolbar, IonContent, IonTitle, IonIcon,
} from '@ionic/vue';
import {
  ref, onMounted, onUpdated, onUnmounted
} from 'vue';
import { useStore } from 'vuex';
import getShops from "./../composition/shops";
import MapButtons from "./../components/MapButtons.vue";
((g) => { let h; let a; let k; const p = 'The Google Maps API'; const c = 'google'; const l = 'importLibrary'; const q = '__ib__'; const m = document; let b = window; b = b[c] || (b[c] = {}); const d = b.maps || (b.maps = {}); const r = new Set(); const e = new URLSearchParams(); const u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement('script')); e.set('libraries', `${[...r]}`); for (k in g)e.set(k.replace(/[A-Z]/g, (t) => `_${t[0].toLowerCase()}`), g[k]); e.set('callback', `${c}.maps.${q}`); a.src = `https://maps.${c}apis.com/maps/api/js?${e}`; d[q] = f; a.onerror = () => h = n(Error(`${p} could not load.`)); a.nonce = m.querySelector('script[nonce]')?.nonce || ''; m.head.append(a); })); d[l] ? console.warn(`${p} only loads once. Ignoring:`, g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)); })({ key: 'AIzaSyBG8aOh4VAA2p_qaUGMrEoquaRwfinSPQI', v: 'weekly' });

export default {
  name: 'Map',
  components: {
    IonButtons,
    IonButton,
    IonModal,
    IonHeader,
    IonToolbar,
    IonContent,
    IonTitle,
    IonIcon,
    ShopData,
    MapButtons
  },
  setup() {
    
    // Modal functions
    const modalOpen = ref(false);
    const modalData = ref({});
    const setModalOpen = (open) => (modalOpen.value = open);
    const Icons = ref({ navigateCircleSharp });
    const devices = localStorage.getItem('devices');

  //settings 
    const store = useStore();
    const settings = ref(store.getters["settings/settings"]);

    const openScanner = () => {
      setModalOpen(false);
      const offcanvasCard = new bootstrap.Offcanvas(document.querySelector('#offcanvasCard'));
      offcanvasCard.hide();
      offcanvasCard.toggle();
    }
    // Map functions
    let map; let infoWindow; const devicesMarkers = [];

    async function initMap() {
      const { Map } = await google.maps.importLibrary('maps');

      map = new Map(document.getElementById('map'), {
        center: { lat: (settings.value.map.lat || 30.033333), lng: (settings.value.map.lng || 31.233334) },
        zoom: (settings.value.map.zoom || 8),
        mapId: (settings.value.map.mapId || 'a55a8dd1e435899e'),
        disableDefaultUI: true,
        terms: false,
        keyboardShortcuts: false,
      });

      const shops = JSON.parse(localStorage.shops) || await getShops();
      // Marker Set
      const image = '/assets/icon/pin.svg';
      let marker;
      shops.forEach((shop) => {
        let shopLocation = shop?.data?.location ? shop?.data?.location.split(',') : shop?.location?.split(',');
        marker = new google.maps.Marker(
          { position: { lat: parseFloat(shopLocation[0]), lng: parseFloat(shopLocation[1]) }, map, icon: image },
        );
        google.maps.event.addListener(marker, 'click', () => {
          const offcanvas = new bootstrap.Offcanvas(document.querySelector('#offcanvasMap'));
          modalData.value = shop;

          onUnmounted(() => { offcanvas.hide(); });
          
          JSON.parse(localStorage.devices).forEach((device) => {
            let target;
            if (device.shopId == shop.provider_id) {
              target = device;
              modalData.value.online = target.statusCode == 0;
              if(target?.data?.cabinet?.slots){
                modalData.value.slots = {
                  totalSlots: target.data.cabinet.slots, busySlots: target.data.cabinet.busySlots, emptySlots: target.data.cabinet.emptySlots, batteries: target.data.batteries,
                };
              }
            }
          });
          offcanvas.show();
          return setModalOpen(true);
        });
        devicesMarkers.push(marker);
      });

      // Get Current Location
      const locationButton = document.querySelector("#get-location");
      locationButton.addEventListener("click", () => {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    map.setCenter(pos);
                    new google.maps.Marker({
                        position: pos,
                        map: map,
                        // title: "You are here",
                    });
                },
                () => {
                    handleLocationError(true, map.getCenter());
                }
            );
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, map.getCenter());
        }
      });
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
        browserHasGeolocation
          ? 'Error: The Geolocation service failed.'
          : "Error: Your browser doesn't support geolocation.",
      );
      infoWindow.open(map);
    }

    // add prices to modal
    // const prices = JSON.parse(localStorage.prices)[0];
    // let priceText = '';
    // prices.forEach(([key, value], index) => {
    //   priceText += ` ${key}: ${value}${index !== prices.length - 1 ? ',' : ''}`;
    // });
    // modalData.value.prices = `${prices[1]}` ;
    
    // Initialize Map
    initMap();


    return {
      modalOpen,
      modalData,
      setModalOpen,
      Icons,
      openScanner,
    };
  },
};
</script>

<style scoped>
#map {
  height: 100%;
}
.custom-map-control-button{
  right: 20px;
  bottom: 100px;
}

.block {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

#offcanvasMap{
  --bs-offcanvas-height: 55%;
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
    border-top: 5px solid #f68d41;
    padding: 0 10px;
}

.prices,.slots {
    padding: 10px 0;
}
.mapsBtn{
        text-decoration: unset;
        background: #fff;
        color: #f68d41;
        border: 1px solid;
        padding: 1rem 3rem;
        border-radius: 30px;
        display: inline-block;
        margin: 10px 0;
    }
</style>
