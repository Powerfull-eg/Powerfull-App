<template>
  <div id="map"></div>

  <!-- Modal -->
    <div class="offcanvas offcanvas-bottom" :is-open="modalOpen" tabindex="-1" id="offcanvasMap" aria-labelledby="offcanvasBottomLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasBottomLabel">{{modalData.shopName}}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body small">
        <div class="status d-flex">
          <img src="assets/icons/battery-full.svg" style="padding: 0 10px 0 0;" width="40" alt="battery-full">
          <span :class="'text text-' + (modalData.online ? 'success' : 'danger')" style="margin-top: 10px;font-weight: 400; font-weight:bold;">{{modalData.online ? " Online" : " Offline"}}</span>
        </div>
        <div class="address">
          {{ modalData.address }}
        </div>
        <div class="working-hours" style="margin-top: 10px;">
          <span>Working Hours: </span>
          <span class="text-success" style="margin-top: 10px;font-weight: 600;">10:00 - 22:00</span>
        </div>
        <div class="prices">
          <span>Price: {{ modalData.prices }}</span>
        </div>
        <div class="slots" v-if="modalData.online">
          <div class="d-flex justify-content-between">
            <span class="text text-success font-weight-bold">Full Slots: {{ modalData.slots.busySlots }}</span>
            <span class="text text-danger font-weight-bold">Empty Slots: {{ modalData.slots.emptySlots }}</span>
          </div>
        </div>
        <div class="d-flex justify-content-evenly" v-if='modalData.online'>
              <a target="_blank" :href="modalData.location" class="mapsBtn">Maps</a>
              <router-link  class="qrBtn" :to="{name: 'scan'}" @click.prevent="openScanner">
                  Scan QR Code
              </router-link>
        </div>
        <div v-else>
          <img src="/assets/icons/fail.png" width="100" alt=""  class="d-block mx-auto">
          <span class="d-block text text-danger" style="font-size: 20px; font-weight: bold;text-align: center; margin-top: 15px;">Device isn't online</span>
        </div>
      </div>

    </div>
</template>

<!-- init map  -->
<script>
import { navigateCircleSharp } from 'ionicons/icons';
import * as bootstrap from 'bootstrap';
import {
  IonButtons, IonButton, IonModal, IonHeader, IonToolbar, IonContent, IonTitle, IonIcon,
} from '@ionic/vue';
import {
  ref, onMounted, onUnmounted, onBeforeMount, provide, reactive, watch, watchEffect,
} from 'vue';
import { useStore } from 'vuex';

((g) => { let h; let a; let k; const p = 'The Google Maps JavaScript API'; const c = 'google'; const l = 'importLibrary'; const q = '__ib__'; const m = document; let b = window; b = b[c] || (b[c] = {}); const d = b.maps || (b.maps = {}); const r = new Set(); const e = new URLSearchParams(); const u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement('script')); e.set('libraries', `${[...r]}`); for (k in g)e.set(k.replace(/[A-Z]/g, (t) => `_${t[0].toLowerCase()}`), g[k]); e.set('callback', `${c}.maps.${q}`); a.src = `https://maps.${c}apis.com/maps/api/js?${e}`; d[q] = f; a.onerror = () => h = n(Error(`${p} could not load.`)); a.nonce = m.querySelector('script[nonce]')?.nonce || ''; m.head.append(a); })); d[l] ? console.warn(`${p} only loads once. Ignoring:`, g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)); })({ key: 'AIzaSyBG8aOh4VAA2p_qaUGMrEoquaRwfinSPQI', v: 'weekly' });

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
  },
  setup() {
    // Modal functions
    const modalOpen = ref(false);
    const modalData = ref({});
    const setModalOpen = (open) => (modalOpen.value = open);
    const Icons = ref({ navigateCircleSharp });
    const devices = localStorage.getItem('devices');

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
        center: { lat: 30.033333, lng: 31.233334 },
        zoom: 8,
        disableDefaultUI: true,
        terms: false,
        keyboardShortcuts: false,
      });

      const locationButton = document.createElement('button');

      locationButton.innerHTML = '<img width="20" src="https://img.icons8.com/ios-filled/100/define-location--v1.png" alt="define-location--v1"/>';
      locationButton.style.padding = '10px';
      locationButton.style.marginRight = '5px';
      locationButton.style.backgroundColor = '#f7f3e9';
      locationButton.style.borderRadius = '10px';
      locationButton.style.bottom = '40px ';

      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);

      infoWindow = new google.maps.InfoWindow();
      // Current Location
      locationButton.addEventListener('click', () => {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              const marker = new google.maps.Marker({
                position: pos,
              });
              infoWindow.setPosition(pos);
              infoWindow.setContent('Location found.');
              infoWindow.open(map);
              map.setCenter(pos);
              map.setZoom(15);
            },
            () => {
              handleLocationError(true, infoWindow, map.getCenter());
            },
          );
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      });

      // Marker Set
      const image = '/assets/icon/pin.png';
      let marker;
      JSON.parse(localStorage.shops).forEach((shop) => {
        marker = new google.maps.Marker(
          { position: { lat: parseFloat(shop.latitude), lng: parseFloat(shop.longitude) }, map, icon: image },
        );
        google.maps.event.addListener(marker, 'click', () => {
          const offcanvas = new bootstrap.Offcanvas(document.querySelector('#offcanvasMap'));
          offcanvas.show();
          onUnmounted(() => {
            offcanvas.hide();
          });
          modalData.value.shopName = shop.shopName;
          modalData.value.address = shop.shopAddress;
          modalData.value.location = `https://www.google.com/maps/search/?api=1&query=${parseFloat(shop.latitude)},${parseFloat(shop.longitude)}`;
          JSON.parse(localStorage.devices).forEach((device) => {
            let target;
            if (device.shopId == shop.newID) {
              target = device;
              console.log(target);
              modalData.value.online = target.statusCode == 0;
              modalData.value.slots = {
                totalSlots: target.data.cabinet.slots, busySlots: target.data.cabinet.busySlots, emptySlots: target.data.cabinet.emptySlots, batteries: target.data.batteries,
              };
            }
          });
          console.log(modalData.value);
          return setModalOpen(true);
        });
        devicesMarkers.push(marker);
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
    const prices = JSON.parse(localStorage.prices)[0];
    console.log(prices)
    let priceText = '';
    prices.forEach(([key, value], index) => {
      priceText += ` ${key}: ${value}${index !== prices.length - 1 ? ',' : ''}`;
    });
    modalData.value.prices = `${prices[1]}` ;
    
    // Initialize Map
    initMap();

    return {
      modalOpen,
      modalData,
      setModalOpen,
      Icons,
      openScanner
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
.offcanvas-header{
  padding: 10px 20px 0 0;
}
.offcanvas-body{
  padding: 0;
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
    .qrBtn {
        text-decoration: unset;
        background: #f68d41;
        color: #fff;
        border: 1px solid;
        padding: 1rem;
        border-radius: 30px;
        margin: 10px 0;
    }
</style>
