<template>
    <!-- <base-layout :show-menu-button="false" loading="lazy" pageTitle="Scan"> -->
        <!-- <ion-row> -->
            <!-- Title -->
            <!-- <ion-col size="12">
                <h2> Scan QR Code </h2>
            </ion-col> -->
            <!-- Scan Button -->
            <!-- <ion-col size="12">
                <ion-icon  @click="offcanvasCard.show()" class="scan" :icon="icons.qrCodeSharp"></ion-icon>
                <button id="modal-btn" style="display:none;" data-bs-toggle="modal" data-bs-target="#modal"></button>

            </ion-col> -->
        <!-- </ion-row> -->
        <!-- Modals -->
        <!-- <div class="offcanvas offcanvas-bottom" tabindex="-1" id="offcanvasScan" aria-labelledby="offcanvasBottomLabel">
            <div class="offcanvas-header fs-3">
              <h5 class="offcanvas-title" id="offcanvasBottomLabel">{{ modalData.header }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body small">
              <div v-if="modalData.loader" class="spinner-border" role="status"></div>
              <span v-if="modalData.loader" class="text-center d-block my-3">Loading...</span>
              <div v-else>
                <img :src="modalData.body.img" alt=""  :width='modalData.body.img && modalData.body.img.endsWith("gif") ? "200" : "50"' class='d-block mx-auto mb-3'>
                <span class='d-block mx-auto fs-4 text-center text' :class="'text-'+modalData.body.textStyle">{{ modalData.body.text }}</span>
              </div>
            </div>
        </div>
        <div class="offcanvas offcanvas-bottom" tabindex="-1" id="offcanvasCard" aria-labelledby="offcanvasBottomLabel">
            <div class="offcanvas-header fs-3">
              <h5 class="offcanvas-title" id="offcanvasBottomLabel">Payment</h5>
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body small">
              <div v-if="cards.length > 0">
                <div v-for="card in cards" :key="card.id" @click="selectCard(card)" class="card-container row my-2">
                    <img src="/assets/icons/credit-card.png" width="15" class="img-fluid col-3" alt="">
                    <div class="info col-6 d-flex flex-column">
                      <span>{{card.card_type}}</span>
                      <span>{{card.card_number}}</span>
                    </div>
                </div>
              </div>
              <div v-else class="alert alert-danger text-center fs-5">There aren't any added cards</div>
              <router-link :to="{name:'Wallet'}"> Add another payment <ion-icon :icon="icons.addCircleOutline"></ion-icon></router-link>
            </div>
        </div> -->
    <!-- </base-layout> -->
    <div></div>

</template>

<script>
import {
  qrCodeSharp,
  addCircleOutline,
} from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';
import {
  ref, onMounted, onUpdated, watchEffect,
} from 'vue';
import axios from 'axios';
import * as bootstrap from 'bootstrap';
import { useRouter } from 'vue-router';
import Button from '../components/Button.vue';
import useToast from '../composition/useToast';

export default {
  name: 'Scan',
  components: {
    IonIcon,
    Button,
  },
  setup() {
    const userData = localStorage.userData ? JSON.parse(localStorage.userData) : '';
    const icons = ref({ qrCodeSharp, addCircleOutline });
    const online = localStorage.connection == true;
    const modalData = ref({ header: '', body: {} });
    const router = useRouter();
    const { openToast } = useToast();
    const offcanvasCard = ref(null);
    const selectedCard = ref({});
    const cards = ref({});
    let offcanvas;

    onMounted(() => {
      offcanvas = new bootstrap.Offcanvas(document.querySelector('#offcanvasScan'));
      offcanvasCard.value = new bootstrap.Offcanvas(document.querySelector('#offcanvasCard'));
    });

    const validateURL = (url) => {
      const pattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(:\d{1,5})?([\/?].*)?$/i;
      return pattern.test(url);
    };

    function showCanvas(success, text, img = null) {
      offcanvas.hide();
      modalData.value = {
        loader: true,
        header: 'In Progress ... ',
        body: {
          img: '/assets/icons/wait.png',
          text: 'Operation In progress...',
          textStyle: 'secondary',
        },

      };
      offcanvas.show();
      modalData.value = {
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

    const getOrders = async () => {
      let orders = null;
      axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
      const url = `${process.env.VUE_APP_API_URL}/api/operations/orders`;
      await axios.post(url)
        .then((res) => {
          console.log(res);
          orders = res.data.orders;
        })
        .catch((err) => {
          console.log(err);
          orders = null;
        });
      return orders;
    };

    const getCards = async () => {
      axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
      const url = `${process.env.VUE_APP_API_URL}/api/operations/get-cards`;
      await axios.get(url)
        .then((res) => {
          cards.value = res.data.cards;
          // Update user cards
          const data = JSON.parse(localStorage.userData);
          data.cards = cards.value;
          localStorage.userData = JSON.stringify(data);
        })
        .catch((err) => console.log(err));

      return cards;
    };
    watchEffect(getCards);

    const selectCard = async (card) => {
      const orders = await getOrders();
      // Check if there are cards exist

      console.log(cards);
      if (cards.value.length <= 0) {
        setTimeout(() => {
          openToast("You doesn't have any added card", 'danger', 'bottom');
        }, 500);
      } else if (orders != null) {
        // check in completed orders
        if (orders.length > 0) {
          let inCompletedOrders = 0;
          orders.map((order) => { order.status != 3 ? inCompletedOrders++ : ''; });
          if (inCompletedOrders > 0) {
            openToast("You Can't place new order unless complete the previous one", 'danger', 'bottom');
            return;
          }
        }
        selectedCard.value = card;
        offcanvasCard.value.hide();
        scan();
      } else if (orders == null) { openToast('Please Check your internet connection and try again', 'danger', 'bottom'); }
    };
    const scan = async () => {
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
          modalData.value = {
            loader: true,
            header: 'In Progress ... ',
            body: { img: '/assets/icons/wait.png', text: 'Operation In progress...', textStyle: 'secondary' },
          };
          console.log(success);
          const url = `${process.env.VUE_APP_API_URL}/api/operations/rent`;
          const qrcodeUrl = new URL(success.text).search;
          const device = new URLSearchParams(qrcodeUrl)?.get('device');

          if (!validateURL(success.text)) {
            showCanvas(false, "The qr code isn't valid url \n please contact our support.");
          } else if (!device) {
            showCanvas(false, "The qr code doesn't have valid device \n please contact our support.");
          } else {
            axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;

            // send request to rent device
            axios.post(url, { device, userId: userData.id, card: selectedCard.value })
            // If request sent response is 200
              .then((response) => {
                console.log(response);
                // If rent is success
                if (JSON.parse(response.data[1]).code == 0) {
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
    return {
      icons, modalData, openToast, userData, selectCard, offcanvasCard, cards,
    };
  },
};
</script>

<style scoped>

ion-col {
    text-align: center;
}

ion-col:first-of-type > h2 {
    text-align: center;
    /* font-family: cursive; */
    color: var(--main-color-light);
    margin: 15% 0 0 0;
    font-size: 34px;
}
.scan {
    padding: 10px;
    margin: 20px;
    font-size: 1000%;
    border: 10px solid;
}

#offcanvasScan,#offcanvasCard{
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
.offcanvas-header{
  padding: 20px 20px 0 0;
}
.offcanvas-body{
  padding: 0;
  padding-top: 30px;
}

#offcanvasCard div.info {
    margin-top: 10px;
}
#offcanvasCard div.info > span {
    font-size: 16px;
    font-weight: 300;
}
#offcanvasCard div.info > span:first-of-type {
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
    margin: 20px;
    font-size: 20px;
}
</style>
