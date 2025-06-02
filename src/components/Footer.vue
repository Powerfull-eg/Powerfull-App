<template>
  <div class="footer d-flex">
    <div class="icon-container text-center d-flex flex-row justify-content-around align-items-center" v-for="item in footerList" :class=item.class2 :key="item.id">
      <div v-if="item.target === '/scan'" @click.prevent="offcanvasCard.show()"
        class="text-decoration-none d-flex flex-column footer-link justify-content-center align-items-center">
        <img style="width: 70px;" :src="'assets/icons/' + item.icon + '.png'">
        <h6 style="width: 110px;" class=" text-center text-decoration-none text-white">{{ item.title }}</h6>
      </div>
      <router-link v-else class="text-decoration-none d-flex flex-column footer-link justify-content-center align-items-center"
        :to="item.target" :class=item.class>
        <img style="width: 70px;" :src="'assets/icons/' + item.icon + '.png'">
        <h6 style="width: 110px;" class=" text-center text-decoration-none text-white">{{ item.title }}</h6>
      </router-link>
    </div>
  </div>
  <!-- Canvas -->
  <div class="offcanvas offcanvas-bottom" tabindex="-1" id="offcanvasScan" aria-labelledby="offcanvasBottomLabel">
    <div class="offcanvas-header fs-3">
      <h5 class="offcanvas-title" id="offcanvasBottomLabel">{{ canvasData.header }}</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body small">
      <div v-if="canvasData.loader" class="spinner-border" role="status"></div>
      <span v-if="canvasData.loader" class="text-center d-block my-3">{{ t("Loading")}}...</span>
      <div v-else>
        <img :src="canvasData.body.img" alt=""
          :width='canvasData.body.img && canvasData.body.img.endsWith("gif") ? "200" : "50"' class='d-block mx-auto mb-3'>
        <span class='d-block mx-auto fs-4 text-center text' :class="'text-' + canvasData.body.textStyle">{{
          canvasData.body.text }}</span>
      </div>
    </div>
  </div>
  <CardsComponent :action="scan"/>
  <!-- Modal -->
  <div class="modal fade text-dark" id="giftModal" tabindex="-1" aria-labelledby="giftModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header mx-auto">
          <h1 class="modal-title text-center fs-5 fw-bold" style="color: var(--background)" id="giftModalLabel">{{
            modal.gift.title_ar }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <img class="shake-top" style="width: 100px;display:block;margin: 0 auto;"
            src="/assets/icons/gift.png" :alt="modal.gift.title_ar">
          <div style="direction: rtl;">{{ modal.gift.message_ar }} {{ modal.shop_name }}</div>
          <router-link to="/gifts" @click="bsModal.toggle()" class="btn show-gift">{{t("Show")}}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  personCircleSharp,
  qrCodeSharp,
  filterSharp,
  appsSharp,
  addCircleOutline,
  refreshOutline
} from 'ionicons/icons';

import { IonFooter, IonToolbar, IonIcon, IonAlert, IonSpinner, loadingController } from '@ionic/vue';
import {
  ref, onMounted, onUpdated, watchEffect,
} from 'vue';
import axios from 'axios';
import * as bootstrap from 'bootstrap';
import { useRouter } from 'vue-router';
import { tsParticles } from './../assets/tsParticles-confetti';
import CardsComponent from '../components/footer/CardsComponent.vue';
import { useI18n } from 'vue-i18n';
import particlesOptions from "./../assets/particlesOptions";
const curved = document.querySelector('.scanBtn');

export default {
  name: 'Footer',
  components: {
    IonFooter,
    IonToolbar,
    IonIcon,
    IonAlert,
    IonSpinner,
    CardsComponent
  },
  setup() {
    const { t } = useI18n();
    const footerList = ref([]);
    const auth = localStorage.isAuth == true;
    const userData = localStorage.userData ? JSON.parse(localStorage.userData) : '';
    const icons = {
      qrCodeSharp, addCircleOutline, personCircleSharp, qrCodeSharp, filterSharp, appsSharp,refreshOutline
    };
    const online = localStorage.connection == true;
    const canvasData = ref({ header: '', body: {} });
    const modal = ref({ title: "", message: "", gift: "" });
    const router = useRouter();
    const offcanvasCard = ref(null);
    const selectedCard = ref({});
    const loaderDone = ref(false);
    let offcanvas;
    const bsModal = ref(null);
    onMounted(() => {
      footerList.value = [
        {
          id: 1, title: t('How To Use'), icon: 'help', target: '/intro', class: 'profileBtn', class2: 'profileCon',
        },
        {
          id: 2, title: t('Scan'), icon: 'scanqrwhite', target: (auth ? '/scan' : '/profile'), class: 'scanBtn', class2: 'scanCon',
        },
        {
          id: 3, title: t('All Stations'), icon: 'nearest', target: '/locations', class: 'switch', class2: 'nearestCon',
        },
      ];

      offcanvas = new bootstrap.Offcanvas(document.querySelector('#offcanvasScan'));
      offcanvasCard.value = new bootstrap.Offcanvas(document.querySelector('#offcanvasCard'));
      bsModal.value = new bootstrap.Modal(document.querySelector('#giftModal'), { backdrop: false, keyboard: false });
    });
    // Scan Functions
    // Validate the scanning result url
    const validateURL = (url) => {
      const pattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(:\d{1,5})?([\/?].*)?$/i;
      return pattern.test(url);
    };
    // show the canvas as per the result of scanning
    function showCanvas(success, text, img = null) {
      offcanvas.hide();
      canvasData.value = {
        loader: true,
        header: 'In Progress ... ',
        body: {
          img: '/assets/icons/wait.png',
          text: 'Operation In progress...',
          textStyle: 'secondary',
        },

      };
      offcanvas.show();
      canvasData.value = {
        loader: false,
        header: success ? 'Scan Success' : 'Scan Failed',
        body: {
          img: !img ? (success ? '/assets/icons/success.png' : '/assets/icons/fail.png') : img,
          text,
          textStyle: success ? 'success' : 'danger',
        },
      };
    }

    // Check Internet
    if (!online) {
      offcanvas.hide();
      showCanvas(false, 'No Intenet ,You are not online \n Please connect to newtwork and try again later');
      setTimeout(() => { offcanvas.hide(); router.push({ name: 'home' }); }, 5000);
    }

    
    // make user chppse bretween current cards

    const checkGifts = (gift) => {
      if (gift === null) return;
      modal.value = gift;
      console.log(gift, modal.value)
      bsModal.value.show();
      const particles = tsParticles.load(particlesOptions);
      setTimeout(() => { particles.then(data => data.destroy()) }, 3000);
    };

    // scan the qr code
    const scan = async (card,cvv=null) => {
      showLoader();
      // Firing the plugin
      cordova.plugins.mlkit.barcodeScanner.scan(
        // Scan options
        {
          beepOnSuccess: false,
          vibrateOnSuccess: true,
          detectorSize: 0.6,
          rotateCamera: false,
        },
        // When scan succeded
        (success) => {
          offcanvas.show();
          canvasData.value = {
            loader: true,
            header: 'In Progress ... ',
            body: { img: '/assets/icons/wait.png', text: 'Operation In progress...', textStyle: 'secondary' },
          };
          console.log(success);
          const url = `${process.env.VUE_APP_API_URL}/api/operations/rent`;
          const qrcodeUrl = new URL(success.text).search;
          const device = new URLSearchParams(qrcodeUrl)?.get('device');
          const voucher = JSON.parse(localStorage?.selectedVoucher ?? null)?.id ?? null;
          
          if (!validateURL(success.text)) {
            showCanvas(false, "The qr code isn't valid url \n please contact our support.");
          } else if (!device) {
            showCanvas(false, "The qr code doesn't have valid device \n please contact our support.");
          } else {
            axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;

            // send request to rent device
            axios.post(url, { device, userId: userData.id, card: card, voucher: voucher, cvv: cvv })
              // If request sent response is 200
              .then((response) => {
                console.log(response);
                // If rent is success
                if (JSON.parse(response.data[1]).code == 0) {
                  // Check for gifts
                  checkGifts(response.data.gift);
                  const orderData = setInterval(() => {
                    const getOrderUrl = `${process.env.VUE_APP_API_URL}/api/operations/orderbytrade`;
                    axios.post(getOrderUrl, { tradeNo: JSON.parse(response.data[1]).data.tradeNo })
                      .then((res) => {
                        if (res.data.order.borrowSlot !== null) {
                          showCanvas(true, 'Powerbank rented successfully', `/assets/images/slots/${res.data.order.borrowSlot}.gif`);
                          clearInterval(orderData);

                        }
                      })
                      .catch((err) => {
                        console.log(err);
                        showCanvas(false, 'Something went wrong \n Please try again later');
                        clearInterval(orderData);
                      });
                  }, 500);
                  // If rent failed
                } else {
                  showCanvas(false, 'Something went wrong \n Please try again later');
                }
              })
              // If request can't get to server
              .catch(
                (e) => {
                  console.log(`error : ${e}`);
                  showCanvas(false, 'Something went wrong ,Can\'t conneect server');
                },
              );
          }
        },
        // When scan didn't Succes
        (error) => {
          console.log(`Scanning failed: ${error}`);
          showCanvas(false, 'Something went wrong ,Can\'t scan Qrcode \n Please try again later');
        },
      );
    };

    const locale = localStorage.locale;

    const showLoader = async () => {
        const loading = await loadingController.create({
            message: t('Loading') + ' ...',
            duration: 3000
        });

        await loading.present();
        loaderDone.value = true;
    }

    return {
      footerList,
      icons,
      canvasData,
      userData,
      offcanvasCard,
      modal,
      bsModal,
      locale,
      t,
      loaderDone,
      scan
    };
  },
};
</script>

<style scoped>
.profileBtn>img {
  width: 30px !important;
}

.switch>img {
  width: 50px !important;
}

.scanBtn>img {
  width: 70px !important;
  padding: 5px;
}

.scanCon {
  position: relative;
}

.scanCon::after {
  width: 43px;
  height: 42px;
  background-color: transparent;
  position: absolute;
  content: "";
  top: 12px;
  left: -29px;
  border-bottom-right-radius: 100%;
  z-index: 0;
  border-bottom: 13px solid var(--background);
  border-right: 13px solid var(--background);
}

.scanCon::before {
  width: 43px;
  height: 42px;
  background-color: transparent;
  position: absolute;
  content: "";
  top: 12px;
  right: -28px;
  border-bottom-left-radius: 100%;
  z-index: 0;
  border-bottom: 13px solid #f27920;
  border-left: 13px solid #f27920;
}

div.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  justify-content: space-evenly;
  background: var(--background);
  min-height: 10%;
  /* border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px; */
}

div.icon-container ion-icon {
  font-size: 35px;
  /* border: 4px solid var(--main-color-light); */
  padding: 15px;
  /* border-radius: 50px;
        background: #fff;
        color: #f68d41; */
  color: var(--color);
}

div.icon-container:nth-of-type(2) {
  margin-top: -2.5rem;
  background-color: var(--background);
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  padding: 1.3rem 1.5rem;

}

div.icon-container:nth-of-type(2) {
  margin-top: -2.5rem;
  background-color: var(--background);
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  padding: 1rem 0.1rem;
}

div.icon-container h6 {
  font-size: 0.9rem;
  padding: 5px;
}

/* Canvas styles */
#offcanvasScan,
#offcanvasCard {
  --bs-offcanvas-height: 55%;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  border-top: 5px solid #f68d41;
  padding: 0 10px;
}

.spinner-border {
  color: var(--background);
  margin: 0 auto;
  display: block;
}

.offcanvas-header {
  padding: 20px 20px 0 0;
}

.offcanvas-body {
  padding: 0;
  padding-top: 30px;
}

#offcanvasCard div.info {
  margin-top: 10px;
}

#offcanvasCard div.info>span {
  font-size: 16px;
  font-weight: 300;
}

#offcanvasCard div.info>span:first-of-type {
  font-weight: 600;
}

#offcanvasCard .card-container {
  border: 0.5px solid #a19090;
  margin: 10px;
  border-radius: 12px;
}

#offcanvasCard a {
  text-decoration: unset;
  text-align: center;
  display: block;
  margin: 5px;
  font-size: 20px;
}

/* Modal */
#giftModalLabel {}

/* Animations */
.shake-top {
  -webkit-animation: shake-top 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
  animation: shake-top 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
}

.show-gift {
  color: var(--background);
  border: 1px solid;
  width: 50%;
  margin: 10px auto;
  background: var(--color);
  text-align: center;
  display: block;
}


/**
 * ----------------------------------------
 * animation shake-top
 * ----------------------------------------
 */
@-webkit-keyframes shake-top {

  0%,
  100% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transform-origin: 50% 0;
    transform-origin: 50% 0;
  }

  10% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg);
  }

  20%,
  40%,
  60% {
    -webkit-transform: rotate(-4deg);
    transform: rotate(-4deg);
  }

  30%,
  50%,
  70% {
    -webkit-transform: rotate(4deg);
    transform: rotate(4deg);
  }

  80% {
    -webkit-transform: rotate(-2deg);
    transform: rotate(-2deg);
  }

  90% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg);
  }
}

@keyframes shake-top {

  0%,
  100% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transform-origin: 50% 0;
    transform-origin: 50% 0;
  }

  10% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg);
  }

  20%,
  40%,
  60% {
    -webkit-transform: rotate(-4deg);
    transform: rotate(-4deg);
  }

  30%,
  50%,
  70% {
    -webkit-transform: rotate(4deg);
    transform: rotate(4deg);
  }

  80% {
    -webkit-transform: rotate(-2deg);
    transform: rotate(-2deg);
  }

  90% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg);
  }
}
</style>
