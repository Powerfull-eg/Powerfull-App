<template>
  <base-layout :show-menu-button="false" :pageTitle="t('Usage History')" loading="lazy">
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
    <div v-else class="orders-container w-100 row my-2">
      <div class="calender w-100 text-center mx-auto my-5" @click="datepicker">
        <input id="calender" type="text" name="calender" :value="t('Date')" readonly />
      </div>
      <div v-if="orders.length == 0" class="no-content text-center">
        <img width="50" src="/assets/icons/no-content.png" alt="No Content">
        <h4 style="font-weight: 600; margin: 20px;"> {{ t('No Orders Available') }}</h4>
      </div>
      <div v-else class="d-flex flex-column justify-content-center align-items-center">

        <div class="order my-3" v-for="order in orders" :key="order.id"
          :data-month="(new Date(new Date(order.borrowTime) - timezoneDiff)).getMonth() + 1">
          <router-link class="w-100 d-flex flex-row" :to="{ name: 'Order', params: { id: order.id } }">
            <div class="order-image"><img :src="shopData(order.station_id)?.logo ?? '/assets/images/powericon.png'"
                width="100" alt=""></div>
            <div class="d-flex flex-column ms-3 w-75">
              <span class="date fw-bold">{{ new Date(order.created_at).toISOString().replace(/T.*/, '').split('-').reverse().join('-') }}</span>
              <span class="name fw-bold " style="font-size: 1.2rem;color: var(--background);">{{ shopData(order.station_id)?.name ?? '' }}</span>
              <div class="d-flex justify-content-between">
                <span class="price me-2" style="font-weight: bold;">{{ order.amount > 0 ? order.amount + " EGP" : t('Free') }}</span>
                <span :class="'status text text-' + status[order.status].class" style="font-weight: bold;">{{
                  status[order.status].text }}</span>
              </div>
            </div>
            <div style="flex: 3 1; text-align: end; align-self: center;"></div>
          </router-link>
        </div>
      </div>
    </div>

  </base-layout>
</template>

<script>
import {
  ref, onMounted, onUpdated, watchEffect,
} from 'vue';

import axios from 'axios';
import { useRouter } from 'vue-router';
import { addCircleOutline, chevronForwardOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';
import AirDatepicker from 'air-datepicker';
import useToast from '../../../composition/useToast';
import 'air-datepicker/air-datepicker.css';
import localeEn from 'air-datepicker/locale/en';
import { useI18n } from 'vue-i18n';

export default {
  name: 'Tickets',
  components: {
    IonIcon,
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const timezoneDiff = 1000 * 60 * 60 * 6;
    const { openToast } = useToast();
    const loader = ref(true);
    const allOrders = ref([]);
    const orders = ref([]);
    const icons = { addCircleOutline, chevronForwardOutline };
    const error = ref(false);
    const result = ref({});
    const status = {
      0: { text: t('New'), class: 'primary' },
      1: { text: t('Ongoing'), class: 'warning' },
      2: { text: t('Completed'), class: 'dark' },
      3: { text: t('Paid'), class: 'success' },
      4: { text: t('Payment Failed'), class: 'danger' },
    };

    // Check Internet
    if (localStorage.connection == false) {
      openToast(t('You are offline please reconnect and try again'), 'danger', 'bottom');
      return router.go(-1);
    }

    const getOrders = async () => {
      axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
      const url = `${process.env.VUE_APP_API_URL}/api/operations/orders`;
      await axios.post(url)
        .then((res) => {
          console.log(res);
          allOrders.value = res.data.orders;
          orders.value = allOrders.value;
          console.log(orders.value);
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

    watchEffect(getOrders());

    onUpdated(() => {
      setTimeout(() => { loader.value = false; }, 3000);
      error.value = false;
      orders.value = allOrders.value;
    });

    function shopData(deviceID) {
      let shop; 
      let shopId;
      const devices = JSON.parse(localStorage.devices);
      const shops = JSON.parse(localStorage.shops);
      devices.map((device) => {
        if (deviceID === device.DeviceId) {
          shopId = device.shopId;
          shops.map((savedShop) => {
            if (shopId === savedShop.provider_id) {
              shop = savedShop;
            }
          });
        }
      });
      return shop ?? null;
    }

    const filterOrdersByMonth = (orders, month) => {
      const filteredOrders = [];
      console.log(orders);
      orders.map((order) => {
        if (((new Date(new Date(order.borrowTime) - timezoneDiff)).getMonth() + 1) == month) { filteredOrders.push(order); }
      });
      return filteredOrders;
    };

    const datepicker = () => {
      // eslint-disable-next-line no-new
      new AirDatepicker('#calender', {
        view: 'months',
        minView: 'months',
        dateFormat: 'MM yyyy',
        autoClose: true,
        locale: localeEn,
        position: 'bottom center',
        onSelect: ({ date }) => {
          console.log(filterOrdersByMonth(allOrders.value, (new Date(date)).getMonth() + 1));
          orders.value = filterOrdersByMonth(allOrders.value, (new Date(date)).getMonth() + 1);
        },
      });
    };
    datepicker();

    return {
      loader,
      orders,
      icons,
      error,
      result,
      status,
      datepicker,
      shopData,
      timezoneDiff,
      t
    };
  },
};
</script>

<style scoped>
a.addbtn {
  text-decoration: unset;
  text-align: center;
  display: block;
  margin: 0 auto;
  font-size: 20px;
  background-color: #fff;
  padding: 20px;
  width: 80%;
  border-radius: 40px;
  color: #f27920;
}

.loader {
  text-align: center;
  margin: 10rem auto;
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

.orders-container {
  margin-bottom: 40% !important;
}

.order {
  /* border: 0.5px solid var(--color); */
  border-radius: 20px;
  text-align: start;
  padding: 10px 20px;
  width: 75%;
  font-size: 1rem;
  background: var(--color);
  box-shadow: #00000080 0px 4px 10px 0px;
}

.order-image {
  padding: 10px;
  background: #fff;
  border: 2px solid #ddd;
  border-radius: 14px;
  min-width: 10%;
  max-width: 25%;
}

span.status {
  /* font-size: 15px;
    min-width: 20%;
    text-align: center; */
}

.order a {
  text-decoration: unset;
  color: #000;
}

.order div.name {
  font-size: 20px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 60%;
}

input#calender {
  width: 80%;
  padding: 15px;
  border-radius: 40px;
  text-align: center;
  font-size: 23px;
  cursor: pointer;
  caret-color: transparent;
  background-color: inherit;
  border: 2px solid var(--color);
}
</style>
