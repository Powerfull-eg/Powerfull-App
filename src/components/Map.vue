<template>
  <div id="map"></div>

  <!-- Modal -->
    <div class="offcanvas offcanvas-bottom" :is-open="modalOpen" tabindex="-1" id="offcanvasMap" aria-labelledby="offcanvasBottomLabel">
      <div class="offcanvas-header">
        <div class="top d-flex justify-content-between w-100 pb-3">
          <!-- shop image -->
          <div class="shop-logo" style="flex-basis: 20%; width: 100%; position: relative">
            <img src="assets/images/powericon.png" style="position: absolute; object-fit: contain; top: 10%; width: 75%; height: 75%;">
          </div>
          <!-- name and summary data -->
          <div class="shop-info" style="flex-basis: 100%;">
            <!-- name -->
            <div class="shop-name" style="flex-basis: 70%;display: grid;">
              <div class="d-flex elipsis">
                <h2 class="offcanvas-title" >{{modalData.shopName}}</h2>
              </div>
            </div>
            <!-- summary data -->
            <div class="summary d-flex flex-row justify-content-start">
              <!-- distance -->
              <div class="distance" style="padding-right: 5px;">
                <img src="assets/icons/telegram.svg" style=" width: 1rem" alt="distance">
                <span>1.5 km</span>
              </div>
              <!-- time -->
              <div class="timing d-flex flex-row" style="padding: 0 5px 0 0;">
                <img src="assets/icons/time.svg" style=" width: 1rem;" alt="distance">
                <span class="font-weight-bold" style="color: #00ff00; padding: 0 5px 0 0;"> مفتوح </span>
                <span>22:00 يغلق</span>
              </div>
              <!-- device status -->
              <div class="device-status">
                <div class="font-weight-bold" style="padding:3px; background-color: #8ac78a;"> 
                  <span style="border-radius: 50%; height: 100%;" class="bg-success d-block"></span>
                  <span>جاهز للإستخدام</span>
                </div>
              </div>
            </div>
          </div>
          <!-- close -->
          <button type="button" style="position: absolute; top: 20px; right: 10px;" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <!-- <h5 class="offcanvas-title" id="offcanvasBottomLabel">{{modalData.shopName}}</h5> -->
      </div>
      <div class="offcanvas-body small middle">
        <!-- Body Top Part -->
        <div class="body-top d-flex justify-content-between w-100 px-3" style="height: 50px;">
          <!-- Access -->
          <div class="access d-flex">
            <img src="assets/icons/telegram.svg" alt="distance">
            <div class="d-flex flex-column">
              <span>صلاحية الوصول</span>
              <span>مكان عام</span>
            </div>
          </div>
          <!-- Type -->
          <div class="type d-flex">
            <img src="assets/icons/telegram.svg" alt="distance">
            <div class="d-flex flex-column">
              <span>النوع</span>
              <span>مول</span>
            </div>
          </div>
          <!-- Price -->
          <div class="price d-flex">
            <img src="assets/icons/telegram.svg" alt="distance">
            <div class="d-flex flex-column">
              <span>السعر</span>
              <span>25 EGP/hr</span>
            </div>
          </div>
        </div>
        <!-- Body middle Part -->
        <div class="body-middle d-flex justify-content-between w-100 p-3" style="height: 50px;">
          <!-- qr scan button -->
          <div class="qr-scan d-flex">
            <img src="assets/icons/telegram.svg" alt="distance">
            <span>امسح رمز الإستجابة</span>
          </div>
          <!-- location btn -->
          <div class="location d-flex">
            <img src="assets/icons/telegram.svg" alt="distance">
            <span>الموقع</span>
          </div>          
          <!-- Save shop -->
          <div class="save d-flex">
            <img src="assets/icons/telegram.svg" alt="distance">
            <span>حفظ</span>
          </div>
        </div>
        <!-- Body bottom Part -->
        <div class="body-bottom">
          <!-- Navigator -->
          <div class="navs d-flex justify-content-between align-items-center mx-auto px-3">
            <!-- battery-nav -->
            <div class="battery-nav selected">
              <span>البطارية</span>
              &nbsp;
              <span class="battery-live" style="background-color: var(--background); padding: 0 4px; color: var(--color);">4</span>
            </div>
            <!-- menu-nav -->
            <div class="menu-nav">
              <span>المنيو&الخصومات</span>
            </div>          
            <!-- rate-nav -->
            <div class="rate-nav">
              <span>التقييم</span>
            </div>
          </div>
        </div>
        <!-- Bottom Content -->
        <div class="bottom-content">
          <!-- Batteries -->
          <div id="batteries" class="batteries p-3">
            <div class="d-flex flex-nowrap justify-content-evenly">
              <div class="battery" v-for="i in 6" :key="i" :style="(i < 5 ? 'background: var(--background);':'')">
                <span>&nbsp;</span>
              </div>
            </div>
            <!-- Batteries Data-->
            <div class="batteries-data d-flex justify-content-between w-100 pt-3">
              <!-- Filled Batteries -->
              <div class="filled-batteries d-flex align-items-center justify-content-center">
                <img src="assets/icons/telegram.svg" style="width: 2rem;" alt="Filled Battery">
                <span>المنافذ الممتلئة</span>
                <span style="color: var(--background);color: var(--background);font-size: 2rem;padding: 0 3px;margin-top: -10px;"> . </span>
                <span>4</span>
              </div>
              <!-- Empty Batteries -->
              <div class="empty-batteries d-flex align-items-center justify-content-center">
                <img src="assets/icons/telegram.svg" style="width: 2rem;" alt="Empty Battery">
                <span>المنافذ الفارغة</span>
                <span style="color: var(--background);color: var(--background);font-size: 2rem;padding: 0 3px;margin-top: -10px;"> . </span>
                <span>2</span>
              </div>
            </div>
          </div>
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

      // const locationButton = document.createElement('button');

      // locationButton.innerHTML = '<img width="20" src="https://img.icons8.com/ios-filled/100/define-location--v1.png" alt="define-location--v1"/>';
      // locationButton.style.padding = '10px';
      // locationButton.style.marginRight = '5px';
      // locationButton.style.backgroundColor = '#f7f3e9';
      // locationButton.style.borderRadius = '10px';
      // locationButton.style.bottom = '40px ';

      // map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);

      // infoWindow = new google.maps.InfoWindow();
      // // Current Location
      // locationButton.addEventListener('click', () => {
      //   // Try HTML5 geolocation.
      //   if (navigator.geolocation) {
      //     navigator.geolocation.getCurrentPosition(
      //       (position) => {
      //         const pos = {
      //           lat: position.coords.latitude,
      //           lng: position.coords.longitude,
      //         };
      //         const marker = new google.maps.Marker({
      //           position: pos,
      //         });
      //         infoWindow.setPosition(pos);
      //         infoWindow.setContent('Location found.');
      //         infoWindow.open(map);
      //         map.setCenter(pos);
      //         map.setZoom(15);
      //       },
      //       () => {
      //         handleLocationError(true, infoWindow, map.getCenter());
      //       },
      //     );
      //   } else {
      //     // Browser doesn't support Geolocation
      //     handleLocationError(false, infoWindow, map.getCenter());
      //   }
      // });

      // Marker Set
      const image = '/assets/icon/pin.svg';
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
    .elipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 80%;
    }

    .device-status > div {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }

    .summary {
      font-size: .7rem;
    }
    .body-top  img, .body-middle img
    {
      width: 1.3rem;
      height: 1.3rem;
      padding-right: 5px;
    }
    .body-top  > div, .body-middle  > div
    {
    font-size: .6rem;
    color: #474747;
    flex-basis: 30%;
    align-items: center;
    }
    .body-top  > div > div > span:first-of-type,.body-middle {
      font-weight: 900;
    }
    .body-middle {
      font-size: .7rem !important;
      max-height: 30px;
    }
    .qr-scan {
      background: var(--background);
      border-top-right-radius: 10px;
      color: var(--color) !important;
    }
    .body-bottom
    {
      border: 1px solid #474747a1;
      border-radius: 15px;
      font-weight: bold;
      font-size: .7rem;
      padding: 5px 10px;
      width: 90%;
      margin: 0 auto;
    }
    .battery-nav {
      display: flex;
      justify-content: space-between;
    }
    .navs .battery-nav.selected {
      background-color: #dadada;
      color: var(--background);
      padding: 10px 15px;
      border-radius: 15px;
    }
    .battery {
      height: 6rem;
      width: 2rem;
      background: #dadada;
      display: flex;
      align-items: center;
      border-top-right-radius: 10px;
      border-top-left-radius: 10px;
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
    }

    .battery span {
      height: 2rem;
      width: 5px;
      display: block;
      text-align: center;
      background: var(--color);
      margin: 0 auto;
    }
    @media (min-width: 768px) {
    .summary {
      font-size: 2rem;
    }
    .summary img {
      width: 2rem !important;
    }
}
</style>
