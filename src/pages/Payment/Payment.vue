<template>
    <base-layout :showMenuButton=false>
    <!-- <div class="payment-form text-center">
        <img src="/assets/images/payment.png" alt="Payment" class="img-fluid w-75 mb-5 mt-3">
        <form id="payment-form" class="g-3" @submit.prevent="submitForm()">
            <div class="alert alert-warning w-75 mx-auto" style="border-radius: 10px;font-size: .8rem;">Please note that we will deposite 1 EGP of your card to verify it and refund again later.</div>
        <div class="form-inputs d-flex flex-column">
            <ion-input name="cardHolder" required v-model="cardHolder" label-placement="floating" fill="solid" placeholder="Card Holder Name"></ion-input>
            <ion-input name="cardNumber" required v-model="cardNumber" autocomplete label-placement="floating" type="number" placeholder="Enter Card Number"></ion-input>
            <div class="d-flex w-75 mx-auto">
                <label style="align-self: center;font-weight: 600;">Expiration Date </label>
                <ion-input max="12" style="margin-right: 15px; margin-left: 15px;" min="1" name="month" required v-model="month" placeholder="Month" autocomplete label-placement="floating" type="number"></ion-input>
                <ion-input maxlength="4" max="2050" name="year" required v-model="year" autocomplete label-placement="floating" placeholder="Year" type="number"></ion-input>
            </div>
            <ion-input name="cvv" required v-model="cvv" autocomplete label-placement="floating" type="number" placeholder="Enter CVV Number"></ion-input>
            <div class="payment-submit">
                <button type="submit">Submit</button>
            </div>
        </div>
        </form>
    </div> -->
    <div class="image-container" @click="getIframeUrl" style="margin: 50% auto;">
        <img src="assets/icons/add-card.svg" width="200" style="margin: 0 auto;display: block;" alt="">
    </div>
        <!-- Modal -->
    <div class="offcanvas offcanvas-bottom" tabindex="-1" id="offcanvasPayment" aria-labelledby="offcanvasBottomLabel">
        <div class="offcanvas-header fs-3">
            <h5 class="offcanvas-title" id="offcanvasBottomLabel">{{ modalData.header }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body small">
            <div v-if="modalData.loader" class="spinner-border text-center" role="status"></div>
            <span v-if="modalData.loader" class="text-center d-block my-3">Loading...</span>
            <div v-else>
            <img :src="modalData.body.img" alt=""  width='50' class='d-block mx-auto mb-3'>
            <span class='d-block mx-auto fs-4 text-center text' :class="'text-'+ modalData.body.textStyle">{{ modalData.body.text }}</span>
            </div>
        </div>
    </div>
    </base-layout>
</template>

<script>
import { ref, onMounted, onBeforeUpdate } from 'vue';
import axios from 'axios';
import * as bootstrap from 'bootstrap';
import { useRouter } from 'vue-router';

export default {
  name: 'Payment',
  setup() {
    const userData = localStorage.userData ? JSON.parse(localStorage.userData) : '';
    const online = localStorage.connection == true;
    const modalData = ref({ header: '', body: {} });
    const router = useRouter();
    const iframeUrl = ref(null);
    let offcanvas;

    const openIframe = (link) => {
      const Androidoptions = 'location=yes,zoom=no,fullscreen=no,clearcache=yes,clearsessioncache=yes';
      const ref = cordova.InAppBrowser.open(link, '_blank', Androidoptions);
      window.open = cordova.InAppBrowser.open;
    };

    onMounted(() => {
      offcanvas = new bootstrap.Offcanvas(document.querySelector('#offcanvasPayment'));
      getIframeUrl();
    });

    const getIframeUrl = async () => {
      modalData.value.loader = true;
      offcanvas.show();
      axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
      const url = `${process.env.VUE_APP_API_URL}/api/operations/get-iframe-url`;
      await axios.post(url, { amount: 100, userID: JSON.parse(localStorage.userData).id })
        .then((res) => { console.log(res); setTimeout(offcanvas.hide(), 1000); openIframe(res.data.link); })
        .catch((err) => console.log(err));
    };

    function showCanvas(success, text) {
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
      setTimeout(() => {
        modalData.value = {
          loader: false,
          header: success ? 'Payment Success' : 'Payment Failed',
          body: {
            img: success ? '/assets/icons/success.png' : '/assets/icons/fail.png',
            text,
            textStyle: success ? 'success' : 'danger',
          },
        };

        setTimeout(() => { offcanvas.hide(); }, 5000);
      }, 2000);
    }

    // Check Internet
    if (!online) {
      offcanvas.hide();
      showCanvas(false, 'No Intenet ,You are not online \n Please connect to newtwork and try again later');
      setTimeout(() => { offcanvas.hide(); router.push({ name: 'home' }); }, 5000);
    }

    const validateForm = (formData) => {
      const errMessages = []; let status = true;
      const requiredValues = ['cardHolder', 'cardNumber', 'month', 'year', 'cvv'];
      const data = {};

      // Check empty inputs and get data
      requiredValues.map((value) => {
        data[value] = formData.get(value);
        if (data[value] === 'undefined' || data[value] === 'null') {
          errMessages.push(`${value} shouldn't be empty`);
          status = false;
        }
      });

      // check card number length and pattern
      if (data.cardNumber.length < 13 || data.cardNumber.length > 16) {
        errMessages.push('Please enter a valid card number');
        status = false;
      }

      // check month and year
      const yearPattern = /^(20\d{2})$/;
      const year = data.year.length === 2 ? `20${data.year}` : data.year;
      if (parseInt(data.month) < 1 || parseInt(data.month) > 12 || parseInt(year) < 2023 || parseInt(year) > 2060 || !yearPattern.test(year)) {
        errMessages.push('Please enter a valid expiration date');
        status = false;
      }

      // check cvv
      if (data.cvv.length !== 3) {
        errMessages.push('Please enter a valid CVV Number');
        status = false;
      }

      const result = errMessages.length > 0 ? [false, errMessages[0]] : [status, data];

      console.log(result);
      return result;
    };
    async function submitForm() {
      const form = document.querySelector('#payment-form');
      const formData = new FormData(form);
      const validate = validateForm(formData);

      if (!validate[0]) {
        showCanvas(false, validate[1]);
        return;
      }

      const card = validate[1];

      // add card to database
      axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
      const url = `${process.env.VUE_APP_API_URL}/api/operations/add-card`;
      axios.post(url, { card: JSON.stringify(card) })
        .then(
          (success) => {
            if (success.status === 204) {
              showCanvas(false, 'Card already exist');
              return;
            }
            showCanvas(true, 'Card Added successfully');
            // add card to localstorage
            if (localStorage.userData) {
              // eslint-disable-next-line no-shadow
              const userData = JSON.parse(localStorage.userData);
              userData.cards = success.data.userCards;
              localStorage.userData = JSON.stringify(userData);
            }
            setTimeout(() => { router.go(-1); }, 3000);
          },
        )
        .catch((err) => showCanvas(false, 'Something went wrong,\n Please try again'));
    }

    return {
      submitForm, modalData, iframeUrl, getIframeUrl,
    };
  },
};
</script>

<style scoped>
    div.payment-form {
        text-align: center;
        font-size: 1rem;
        background: var(--color);
        color: var(--background);
        margin: 30% 2rem;
        padding: 10% 0;
        border-radius: 30px;
    }
    div.payment-form div.form-inputs > ion-input,div.payment-form div.form-inputs > div > ion-input{
      border: 1px solid var(--main-color-light);
      border-radius: 7px;
      width: 75%;
      margin: 15px auto;
      text-align: start;
      font-size: 15px;
      color: #000;
    }

    div.payment-submit > button{
        background-color: var(--main-color-light);
        color: #fff;
        border: 1px solid var(--main-color-light);
        padding: 10px 50px;
        border-radius: 30px;
        box-shadow: var(--main-color-light) 1px 4px 15px;
        margin: 10px auto;
        display: block;
        width: 50%;
    }

/* Modal */
div.spinner-border {
    color: #f68d41;
    margin: 0 auto;
    display: block;
}

#offcanvasPayment{
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
</style>
