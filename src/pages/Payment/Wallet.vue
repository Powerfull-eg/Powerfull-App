<!-- eslint-disable max-len -->
<template>
  <base-layout page-default-back-link="/" :pageTitle="t('Payment')" :show-menu-button="false" loading="lazy">
    <div class="page-container">
      <div class="saved-methods">
        <!-- cards -->
          <div class="cards my-3 d-flex flex-column justify-content-evenly">

            <!--Show Cards if exist-->
            <div v-if="cards && cards.length > 0" class="">
              <h5 class="text-start d-block font-weight-bold">{{t('My Saved Methods')}}: </h5>
            <div  v-for="card in cards" :key="card.id" class="cardd my-2 d-flex flex-row">
              <ion-icon :icon="icons.cardOutline"></ion-icon>
              <div class="card-data text-start d-flex flex-column">
                <h5 class="">{{card.card_type}}</h5>
                <span>{{card.card_number}}</span>
              </div>
              <ion-icon @click="openCanvas(card.id)" :icon="icons.trashOutline"></ion-icon>

            </div>
          </div>
            <div v-else class="no-content text-center">
              <div style="font-size: 1.2rem;" class="d-flex flex-column">
                <span>{{t("Theres no saved cards")}}</span>
              </div>
              <img width="300" src="/assets/icons/creditcard.png" alt="No Content">
              <!-- <h4 style="font-weight: 600; margin: 20px; font-family: cursive;"> No Payment Methods Available</h4> -->
            </div>
          </div>
        <!-- /cards -->
      </div>
      <div class="footer d-flex pt-3" style="background-color: var(--background); border-radius:10px;">
        <div class="new-payment-container"><a class="newPayment d-flex justify-content-center align-items-center text-decoration-none fs-1" @click.prevent="getIframeUrl">+</a></div>
        <div class="logos w-75 pt-5">
          <div class="types">
            <img src="assets/images/payment.png" alt="card-types" style="background: #fff; padding: 2px; border-radius: 5px; width: 75%;">
          </div>
          <div class="text my-4 d-flex justify-content-center">
            <span class="fs-5 mx-2">Powered By</span>
            <img src="assets/images/paymob.png" alt="Paymob logo" style="width: 30%">
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-else><iframe :src="iframeUrl" frameborder="0" style="width: 100vw; height: 100vh;"></iframe></div> -->
    <!-- Modal -->
    <div class="offcanvas offcanvas-bottom" :is-open="modalOpen" tabindex="-1" id="offcanvasDeleteCard" aria-labelledby="offcanvasBottomLabel">
      <div class="offcanvas-header fs-3">
        <h5 class="offcanvas-title" id="offcanvasBottomLabel">{{ modalData.header }}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body small">
        <div v-if="modalData.loader" class="spinner-border text-center" role="status"></div>
        <span v-if="modalData.loader" class="text-center d-block my-3">{{t('Loading')}}...</span>
        <div v-else>
          <img :src="modalData.body.img" alt=""  width='50' class='d-block mx-auto mb-3'>
          <span class='d-block mx-auto fs-4 text-center text' :class="'text-'+modalData.body.textStyle">{{ modalData.body.text }}</span>
          <div class="mx-3 my-5 w-100 d-flex justify-content-evenly" v-if="!requestSent">
            <button style="border-radius: 30px;" @click="deleteCard(cardId)" class="btn btn-danger py-3 px-5">{{t('Delete')}}</button>
            <button style="border-radius: 30px;" @click="offcanvas.toggle();" class="btn btn-secondary py-3 px-5">{{t('Cancel')}}</button></div>
        </div>
      </div>
    </div>
  </base-layout>
  </template>

<script>
import { IonIcon } from '@ionic/vue';
import {
  addCircleOutline, chevronForwardOutline, cardOutline, trashOutline,
} from 'ionicons/icons';
import {
  ref, onMounted, onUnmounted, onUpdated, watchEffect,
} from 'vue';
import * as bootstrap from 'bootstrap';
import axios from 'axios';
import useToast from '../../composition/useToast';
import { useI18n } from 'vue-i18n';
export default {
  name: 'Wallet',
  components: { IonIcon },
  setup() {
    const { t } = useI18n();
    const modalData = ref({ loader: false, body: { img: '/assets/icons/delete-card.png', text: 'Are you want to delete this payment method ?', textStyle: 'danger' } });
    const icons = {
      addCircleOutline, chevronForwardOutline, cardOutline, trashOutline,
    };
    const cards = ref({});
    const offcanvas = ref(null);
    const cardId = ref(null);
    const requestSent = ref(false);
    const { openToast } = useToast();

    // assign offcanvas on mounted
    onMounted(() => {
      offcanvas.value = new bootstrap.Offcanvas(document.querySelector('#offcanvasDeleteCard'));
    });

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

    const openIframe = (link) => {
      let options;
      if(cordova.platformId === 'ios'){
        options = 'location=yes,clearcache=yes,clearsessioncache=yes,hideurlbar=yes,hardwareback=no,hidenavigationbuttons=yes,toolbarposition=top,presentationstyle=formsheet';
      }else{
        options = 'location=yes,zoom=no,fullscreen=no,clearcache=yes,clearsessioncache=yes,hideurlbar=yes,hardwareback=no,hidenavigationbuttons=yes';
      }
      window.open = cordova.InAppBrowser.open;
      const inAppBrowserRef = cordova.InAppBrowser.open(link, '_blank', options);
      inAppBrowserRef.addEventListener('message', (event) => {
        // Handle the received message from the webpage
        console.log('Received message from InAppBrowser:', event.data);
        if (event.data && event.data.status === 'success') {
          inAppBrowserRef.close();
          openToast(t('Card Added Successfully'), 'success', 'bottom');
        } else if (event.data && event.data.status === 'fail') {
          inAppBrowserRef.close();
          openToast(t('Card Declined'), 'danger', 'bottom');
        }
      });
      inAppBrowserRef.addEventListener('exit', (event) => {
        getCards();
      });
    };

    const getIframeUrl = async () => {
      modalData.value.loader = true;
      offcanvas.value.show();
      axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
      const url = `${process.env.VUE_APP_API_URL}/api/operations/get-iframe-url`;
      await axios.post(url, { amount: 1, userId: JSON.parse(localStorage.userData).id })
        .then((res) => { console.log(res); setTimeout(offcanvas.value.hide(), 1000); openIframe(res.data.link); })
        .catch((err) => console.log(err));
    };

    // const paymentCompletion = () => {
    //   axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
    //   const url = `${process.env.VUE_APP_API_URL}/api/operations/payment-complete`;
    //   const completeInterval = setInterval(async () => {
    //     await axios.get(url, {})
    //       .then((res) => { console.log(res); /* clearInterval(completeInterval) */ })
    //       .catch((err) => console.log(err));
    //   }, 1000);
    // };

    // function replaceWithStars(text) {
    //   let counter = 0;
    //   const chunkSize = 4;
    //   const replacedText = [];
    //   text.split('').forEach((e) => {
    //     if (counter <= text.length - Math.floor(text.length / chunkSize) - 1) {
    //       replacedText.push('*');
    //     } else {
    //       replacedText.push(e);
    //     }
    //     counter++;
    //   });
    //   return replacedText.map((element, index) => (index % chunkSize === chunkSize - 1 ? `${element} ` : element))
    //     .join('');
    // }

    const openCanvas = (card_id) => {
      cardId.value = card_id;
      modalData.value = { loader: false, body: { img: '/assets/icons/delete-card.png', text: t('Are you want to delete this payment method ?'), textStyle: 'danger' } };
      requestSent.value = false;
      offcanvas.value.show();
    };

    const deleteCard = (card_id) => {
      console.log(card_id);
      modalData.value.loader = true;
      axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
      const url = `${process.env.VUE_APP_API_URL}/api/operations/remove-card`;
      axios.post(url, { card_id })
        .then((res) => {
          requestSent.value = true;
          if (res.status == 200) {
            // Remove Card from localstorage
            cards.value = cards.value.filter((card) => card.id !== card_id);
            const userData = JSON.parse(localStorage.userData);
            userData.cards = cards.value;
            localStorage.userData = JSON.stringify(userData);

            console.log(cards.value);

            modalData.value = { loader: true, body: { img: '/assets/icons/success.png', text: t('Card deleted successfully'), textStyle: 'success' } };
          } else {
            modalData.value = { loader: true, body: { img: '/assets/icons/fail.png', text: res.data.msg, textStyle: 'danger' } };
          }
          setTimeout(() => {
            modalData.value.loader = false;
            setTimeout(() => { offcanvas.value.hide(); }, 3000);
          }, 2000);
        })
        .catch((err) => {
          requestSent.value = true;
          modalData.value = { loader: true, body: { img: '/assets/icons/fail.png', text: t('Can\'t delete card \n Please try again later or contact support team'), textStyle: 'danger' } };
          setTimeout(() => {
            modalData.value.loader = false;
            setTimeout(() => { offcanvas.value.hide(); }, 3000);
          }, 2000);
        });
    };

    return {
      icons, cards, modalData, openCanvas, deleteCard, offcanvas, cardId, requestSent, getIframeUrl,t
    };
  },
};
</script>

  <style scoped>
  .page-container {
      width: 75%;
      text-align: center;
      margin: 3rem auto 10rem auto;
      overflow: hidden;
  }
  /* .coupons-link,.newPayment {
    text-align: center;
      border: 2px solid var(--color);
      padding: 1rem;
      margin: 2rem 0;
      border-radius: 20px;
      width: 100%;
      display: block;
      color: unset;
      text-decoration: unset;
      font-size: 1.2rem;
      font-weight: 500;
  } */
  .cardd {
    background: linear-gradient(90deg, rgba(242,121,32,1) 57%, rgba(251,180,108,1) 84%);
      border-radius: 1.6rem;
      padding: 1.5rem;
      color: #fff;
      font-size: 12px;
      align-items: center;
      justify-content: space-between;
      border: 2px solid var(--color);
  }

  .cardd > ion-icon {
      font-size: 2rem;
  }
  .cardd > .card-data {
      margin: 0 20px;
      width: 80%;
  }
  .newPayment{
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
    width: fit-content;
    padding: 2.5rem 0;
    background-color: var(--background);
  }
  /* Modal */
  div.spinner-border {
      color: #f68d41;
      margin: 0 auto;
      display: block;
  }
  #offcanvasDeleteCard{
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
  .footer {
    bottom: 0;
    position: fixed;
    left: 0;
    flex-wrap: nowrap;
}
  @media only screen and(max-width: 400) {
    .cardd {
      padding: .5rem;
    }
  }
  </style>
