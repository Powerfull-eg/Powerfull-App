<template>
  <base-layout :pageTitle="t('Order Details')" :show-menu-button="false" loading="lazy">
    <div v-if="loader || error">
      <div v-if="loader" class="loader">
        <div class="spinner-border" role="status"></div>
        <span class="text-center d-block my-3">{{ t('Loading') }}...</span>
      </div>
      <div v-else class="result my-5">
        <img :src="result.img" style="display: block; margin: 0 auto" width="100" alt="">
        <span :class="'mt-3 d-block text-center fs-5 text text-' + (result.success ? 'success' : 'danger')">{{ result.msg
        }}</span>
      </div>
    </div>
    <div v-else class="order-container" :style="'margin: 3rem 0 9rem 0; direction: ' + (lang == 'ar' ? 'rtl' : 'ltr') + ';'">
      <div class="order-time my-4 p-3">
        <h4 class="my-1 d-block my-2">{{ shop?.name }}</h4>
        <div class="start my-2 d-flex flex-row">
          <div class="order-image"><img src="/assets/icons/clock.svg" width="50" alt=""></div>
          <div class="data d-flex flex-column">
            <span class="title fs-6 text-dark font-weight-bold mx-2 my-1"> {{ t('Start Time') }}</span>
            <span class="content fs-6 mx-2"> {{ setTime(order.borrowTime) }}</span>
          </div>
        </div>
        <div class="duration my-2 d-flex flex-row">
          <div class="order-image"><img src="/assets/icons/power.png" width="50" alt=""></div>
          <div class="data d-flex flex-column">
            <span class="title fs-6 text-dark font-weight-bold mx-2 my-1"> {{ t('Charge Time') }}</span>
            <span class="content fs-6 mx-2"> {{ timeDifference(order.borrowTime, order.returnTime) }}</span>
          </div>
        </div>
      </div>
      <div class="d-flex flex-column">
        <div class="order-details single my-2 d-flex flex-row">
          <div class="order-image m-2"><img class="py-1" src="/assets/icons/direction.png" width="50" alt=""></div>
          <div class="data d-flex flex-column">
            <span class="title fs-6 text-dark font-weight-bold mx-2 my-1"> {{ shop?.name }}</span>
            <span class="content fs-6 mx-2"> {{ order.returnTime ? setTime(order.returnTime) : t("Battery Not Returned") }}</span>
          </div>
        </div>
        <!--  -->
        <div class="order-details single my-2 d-flex flex-row">
          <div class="order-image m-2"><img class="py-1" src="/assets/icons/pay.png" width="50" alt=""></div>
          <div class="data d-flex flex-column">
            <span class="title fs-6 text-dark font-weight-bold mx-2 my-1"> {{ t('Payment Method') }} </span>
            <span class="content fs-6 mx-2"> {{ t('Card') }}</span>
          </div>
        </div>
        <!--  -->
        <div class="order-details single my-2 d-flex flex-row">
          <div class="order-image m-2"><img class="py-1" src="/assets/icons/wallet.png" width="50" alt=""></div>
          <div class="data d-flex flex-column">
            <span class="title fs-6 text-dark font-weight-bold mx-2 my-1"> {{ t('Usage Fee') }}</span>
            <span class="content fs-6 mx-2"> {{ order?.amount ? order.amount + ' ' + t("EGP") : t("Payment Not Completed")}}</span>
          </div>
        </div>
        <!--  -->
        <div class="order-details single my-2 d-flex flex-row">
          <div class="order-image m-2"><img class="py-1" src="/assets/icons/cash.png" width="50" alt=""></div>
          <div class="data d-flex flex-column">
            <span class="title fs-6 text-dark font-weight-bold mx-2 my-1"> {{ t('Total Payment') }}</span>
            <span class="content fs-6 mx-2"> {{ order?.amount ? order.amount + ' ' + t("EGP") : t("Payment Not Completed")}}</span>
          </div>
        </div>
      </div>

      <div v-if="!order.returnTime" class="check my-3 justify-content-evenly d-flex">
        <span style="align-self: center;"> {{ t('Have You returned battery?') }} </span>
        <button class="btn"
          style="border: 1px solid; border-color: var(--color); color: var(--color); border-raduis :5px;"
          @click="checkReturn()">{{ t('Update Order') }}</button>
      </div>
      <router-link class="addbtn" :to="{ name: 'home' }"> {{ t('Place New Order') }} <ion-icon
          style="vertical-align: middle;" :icon="icons.addCircleOutline"></ion-icon></router-link>
    </div>
    <div class="contact">{{ t('Need Help?') }}<router-link to="/tickets/new"> {{ t('Contact Us') }}</router-link></div>
  </base-layout>
</template>

<script>
import { ref, onMounted, onUpdated, watchEffect } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { addCircleOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';
import useToast from '../../../composition/useToast';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

export default {
  name: 'Tickets',
  components: {
    IonIcon,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { openToast } = useToast();
    const loader = ref(true);
    const order = ref([]);
    const icons = { addCircleOutline };
    const error = ref(false);
    const result = ref({});
    const shop = ref({});
    const { t } = useI18n();
    const status = {
      0: { text: t('New'), class: 'primary' },
      1: { text: t('Ongoing'), class: 'warning' },
      2: { text: t('Completed'), class: 'dark' },
    };

    //settings 
    const store = useStore();
    const settings = ref(store.getters["settings/settings"]);
    
    // Check Internet
    if (localStorage.connection == false) {
      openToast(t('You are offline please reconnect and try again'), 'danger', 'bottom');
      return router.go(-1);
    }

    function shopData(deviceID) {
      let shop; 
      let shopId;
      const devices = JSON.parse(localStorage.devices);
      const shops = JSON.parse(localStorage.shops);

      devices.map((device) => {
        if (deviceID === device.DeviceId) {
          shopId = device.shopId;
          shops.map((savedShop) => {
            if (shopId === savedShop.newID) {
              shop = savedShop;
              console.log(shop);
            }
          });
        }
      });
      return shop;
    }

    const getOrder = () => {
      loader.value = true;

      axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
      const url = `${process.env.VUE_APP_API_URL}/api/operations/order/${route.params.id}`;
      axios.post(url)
        .then((res) => {
          console.log(res);
          order.value = res.data.order;
          shop.value = shopData(res.data.order.station_id);

          setTimeout(() => { loader.value = false; }, 2000);
        })
        .catch((err) => {
          console.log(err);
          result.value = {
            img: '/assets/icons/fail.png',
            success: false,
            msg: t('Something went wrong Please try again'),
          };
          error.value = true;
          setTimeout(() => { loader.value = false; }, 2000);
        });
    };
    const checkReturn = () => {
      loader.value = true;
      axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
      const url = `${process.env.VUE_APP_API_URL}/api/operations/check-return/${route.params.id}`;
      axios.post(url)
        .then((res) => {
          console.log(res);
          if (res.data.order.returnTime != null) {
            order.value = res.data.order;
            result.value = {
              img: '/assets/icons/success.png',
              success: true,
              msg: t('Order updated successfully please go back and check your order'),
            };
          } else {
            result.value = {
              img: '/assets/icons/fail.png',
              success: false,
              msg: t("We have checked your order and found that its not completed yet please make sure you completed it and try again"),
            };
          }
          setTimeout(() => { loader.value = false; }, 2000);
        })
        .catch((err) => {
          console.log(err);
          result.value = {
            img: '/assets/icons/fail.png',
            success: false,
            msg: t('Something went wrong Please try again'),
          };
          error.value = true;
          setTimeout(() => { loader.value = false; }, 2000);
        });
    };
    watchEffect(getOrder());

    function timeDifference(startTime, endTime = null) {
      if (!endTime) return t('Powerbank not returned yet');
      const start = new Date(startTime);
      const end = new Date(endTime);

      let timeDiff = end - start;

      const hours = Math.floor(timeDiff / 1000 / 60 / 60);
      timeDiff -= hours * 1000 * 60 * 60;
      const minutes = Math.floor(timeDiff / 1000 / 60);
      timeDiff -= minutes * 1000 * 60;
      const seconds = Math.floor(timeDiff / 1000);
      return `${hours ? (`${hours} ${t('hours')}`) : ''} ${minutes ? (`${minutes} ${t('minutes')}`) : ''} ${seconds} ${t('seconds')}`;
      // return { hours: hours, minutes: minutes, seconds: seconds };
    }
    // const timezoneDiff = 1000 * 60 * 60 * 6;
    const setTime = (dateString) => {
      const date = new Date(dateString);

      const options = {
        timeZone: settings.value?.timezone ?? 'Africa/Cairo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };

      const formattedDate = date.toLocaleString('en-EG', options);
      console.log(formattedDate); 
      return formattedDate;
    }
    const lang = localStorage.locale;
    return {
      loader,
      order,
      icons,
      error,
      result,
      status,
      shop,
      checkReturn,
      timeDifference,
      // timezoneDiff,
      setTime,
      t,
      lang
    };
  },
};
</script>

<style scoped>
a.addbtn {
  text-decoration: unset;
  text-align: center;
  display: block;
  margin: 20px;
  font-size: 20px;
  color: var(--color);
}

.loader {
  text-align: center;
  margin: 10rem auto;
  color: var(--color);
}

.order {
  border: 0.5px solid #f68d41;
  margin: 10px auto;
  border-radius: 12px;
  text-align: start;
  padding: 11px 20px;
  width: 75%;
  font-size: 20px;
}

span.status {
  font-size: 15px;
  min-width: 20%;
  text-align: center;
}

.order a {
  text-decoration: unset;
  color: unset;
}

li.order-details-item {
  list-style: none;
  padding: 10px;
  color: #878787;
  border-bottom: 1px solid;
  width: 85%;
  font-weight: 500;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

li.order-details-item span:first-of-type {
  color: #000;
  max-width: 40%;
}

li.order-details-item span:last-of-type {
  max-width: 65%;
}

li.order-details-item:last-of-type {
  border-bottom: 0;
}

.order-details,
.order-time {
  border: 1px solid;
  width: 75%;
  margin: 0 auto;
  border-radius: 10px;
}

.order-image {
  padding: 10px;
  background: #fff;
  border: 2px solid #ddd;
  border-radius: 14px;
}

.order-details,
.order-time {
  background-color: var(--color);
  color: var(--background);
  box-shadow: #21252942 2px 6px 6px 3px;
}

.data {
    align-self: center;
}

div.order-details {
  width: 80%;
}

.contact {
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  font-size: 20px;
  background: var(--background);
  padding: 3rem 0;
  border-top: 5px solid var(--color);
  border-radius: 20px 20px 0;
}

.contact a {
  color: var(--color);
}
</style>
