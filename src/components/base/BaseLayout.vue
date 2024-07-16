<template>
  <ion-page>
    <ion-header class="theIonHeader" v-if="mapHeader"
      style="background-color: var(--background); height: 15rem; position: absolute; top:0; left: 0;display: flex; flex-direction: column;">
      <div class="d-flex justify-content-between align-items-center my-3">
        <ion-menu-button :color="'#f27920'"
          style="position: fixed;color: #fff; z-index: 100;font-size: 2.7rem;  padding: 5px; border-radius: 50%;"
          color="primary" v-show="showMenuButton"></ion-menu-button>
        <div class="icon-container"> <img style="width:150px;" src="/assets/images/white-logo.png" alt="Powerfull" />
        </div>
        <div @click="router.push('/profile')"
          class="text-start me-1 d-flex flex-column justify-content-start align-items-start " style=" font-weight: 600; padding-right: 1rem;">
          <img :src="userData && userData.photo != '' ? userData.photo : '/assets/icons/avatar.png'"
            class="img-fluid bg-white d-block "
            style="border: 2px solid;border-color: var(--background); border-radius: 50%; width: 3rem;" alt="User Image">
          <div style="line-height: 1.1rem;font-size: 0.9rem;" :class="'d-flex flex-column text-' + (lang === 'ar' ? 'end' : 'start')">
            <span style="color: #fff; display: inline-block;"> {{ t('Welcome!') }}</span><span class="text-white">{{ userData ? userData.first_name : "" }}</span>
          </div>
        </div>
      </div>
      <div class="SearchInput d-flex justify-content-center">
        <div style="position: relative;width: 80%;margin-top: 20px; height: 20px;">
          <input v-on:input="searchForShop(serachCallback)" id="searchInput" class="searchBar h-100" type="search"
            placeholder=''>
          <div id="dropdown" class="dropdown-content"></div>
          <ion-icon class="searchIcon" name="search-sharp"></ion-icon>
          <ion-icon name="close" @click="emptySearch" style="display: none; font-size: 20px;"></ion-icon>
        </div>
      </div>
    </ion-header>
    <ion-menu-button :color="'#f27920'" v-if="hideHeader && !hideMenuBtn && !mapHeader"
      style="position: fixed;color: #f27920; z-index: 100;background-color: #fff;  padding: 5px;font-size: 2.8rem"
      color="primary" v-show="showMenuButton"></ion-menu-button>

    <ion-header v-if="!mapHeader"
      :style="[map ? 'display:none' : '', convertHeaderBg ? 'background-color: var(--background) !important' : '', convertHeaderBg ? 'color: #fff !important' : '']"
      style="border-bottom-right-radius: 0;">
      <div class="d-flex justify-content-between align-items-center my-3">
        <ion-icon :icon="Icons.chevronBackOutline" @click="back()"
          :style="convertHeaderBg ? 'color: #fff' : 'color: #f27920;'"
          style=" align-self: center; font-size: 2.7rem; padding: 5px"></ion-icon>
        <div> <img style="width:150px;"
            :src="convertHeaderBg ? '/assets/images/white-logo.png' : '/assets/images/logo.png'" alt="Powerfull" /> </div>
        <div @click="router.push('/profile')" class="text-start" style=" font-weight: 600;"> <img
            :src="userData && userData.photo != '' ? userData.photo : '/assets/icons/avatar.png'"
            class="img-fluid d-block m-1"
            style="border: 2px solid;border-color: var(--background); border-radius: 50%; width: 3rem;" alt="User Image">

          <div style="line-height: 1.1rem;" class="d-flex flex-column">
            <span :style="convertHeaderBg ? 'color: #fff !important' : 'color: var(--background);'">
              {{ t('Welcome!') }}</span><span>{{ userData ? userData.first_name : "" }}</span>
          </div>
        </div>
      </div>
      <div class="text-center text-center font-weight-bold fs-4">{{ pageTitle }}</div>
    </ion-header>
    <ion-content :class="'${className} content'"
      :style="[!map ? style = 'border-top-left-radius: 100px;' : '', convertHeaderBg ? 'background-color:#fff !important' : '', convertHeaderBg ? '--ion-background-color: #fff' : '--ion-background-color: #f27920']"
      :scroll-events="true">
      <slot />
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonBackButton,
  IonButtons,
  IonMenuButton,
  IonIcon,
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { chevronBackOutline } from 'ionicons/icons';
import * as bootstrap from 'bootstrap';
import { ref } from 'vue';
import searchForShop from '../../composition/searchForShop';
import { useI18n } from 'vue-i18n';

export default {
  name: 'BaseLayout',
  props: {
    pageTitle: {
      type: String,
      required: false,
    },
    pageDefaultBackLink: {
      type: String,
      required: false,
    },
    showMenuButton: {
      type: Boolean,
      default: true,
    },
    ignoreHistory: {
      type: Boolean,
      default: false,
    },
    className: {
      type: String,
      required: false,
    },
    hideHeader: {
      type: Boolean,
      required: false,
    },
    mapHeader: {
      type: Boolean,
      required: false,
    },
    hideMenuBtn: {
      type: Boolean,
      required: false,
    },
    convertHeaderBg: {
      type: Boolean,
      required: false,
    },
    map: {
      type: Boolean,
      required: false,
    },
  },
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonBackButton,
    IonButtons,
    IonMenuButton,
  },
  setup() {
    const router = useRouter();
    const userData = localStorage.userData ? JSON.parse(localStorage.userData) : null;
    const Icons = { chevronBackOutline };
    const modalData = ref({});
    const { t } = useI18n();
    const serachCallback = (shop) => {
      const offcanvas = new bootstrap.Offcanvas(document.querySelector('#offcanvasMap'));
      offcanvas.show();
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
    };

    const emptySearch = () => {
      document.querySelector('#searchInput').value = '';
      document.querySelector('#dropdown').innerHTML = '';
      document.querySelector('#dropdown').style.display = 'none';
      document.querySelector("ion-icon[name='close']").style.display = 'none';
    };
    const lang = localStorage.locale;
    return {
      router,
      userData,
      Icons,
      serachCallback,
      searchForShop,
      emptySearch,
      t,
      lang
    };
  },
  methods: {
    back() {
      this.pageDefaultBackLink ? this.router.push(this.pageDefaultBackLink) : this.router.go(-1);
    },
  },
};
</script>
<style scoped>
/* var(--ion-background-color,#f27920) */
.theIonHeader::after {
  width: 100px;
  height: 100px;
  clip-path: polygon(0 0, 0% 100%, 100% 100%);
  content: "";
  background: var(--background);
  transform: rotate(90deg);
  left: 0;
  position: absolute;
  top: 86%;
}

.searchIcon {
  position: absolute;
  left: 0;
  position: absolute;
  left: 10px;
  top: 30%;
  font-size: 27px;
  color: rgb(31, 144, 31);

}

ion-buttons.icon-container {
  /* width: calc(100% - 3px); */
}

ion-buttons.icon-container>a {
  margin: 0 auto;
}

ion-header {
  padding-bottom: 10px;
  /* margin-top: 10px; */
  border-bottom-right-radius: 30%;
}

.header-md::after {
  background-image: unset;
}

.icon-container {
  flex-basis: 100%;
  text-align: end;
  padding-right: 4rem;
}

ion-content.content {
  --color: #fff;
  overflow: hidden;
}

.searchBar {
  height: 31px;
  width: 80%;
  border-radius: 10px;
  border: none;
  padding: 10px;
  padding-left: 40px;
}

.newPayment {
  width: 20px;
  height: 20px;
  text-align: center;
  border-radius: 50%;
  background: #fff;
  color: #f27920;
  padding: 25px;
  margin: 10px;
}

.new-payment-container {
  bottom: 0;
  position: fixed;
  width: 100%;
  padding: 2.5rem 0;
  background-color: var(--background);
  /* border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
    border-top: 5px solid var(--color); */
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  padding: 11px;
  border-radius: 12px;
  margin: 10px 0;
  max-height: 20vh;
  overflow: auto;
}

#dropdown a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  margin: 10px 0;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

ion-icon[name='close'] {
  display: block;
  font-size: 20px;
  position: absolute;
  top: 10px;
  right: 0;
}

/* Ipad pro*/
@media screen and (min-width: 550px) {
  .icon-container{ 
    flex-basis: 60% !important;
  }
}
</style>
