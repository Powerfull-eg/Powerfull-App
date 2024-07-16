<template>
    <base-layout :show-menu-button="false" loading="lazy" >
        <div v-if="loader || error" >
            <div v-if="loader" class="loader">
                <div  class="spinner-border" role="status"></div>
                <span class="text-center d-block my-3">{{t('Loading')}}...</span>
            </div>
            <div v-else class="result my-5">
                <img :src="result.img" style="display: block; margin: 0 auto" width="100" alt="">
                <span :class="'mt-3 d-block text-center fs-5 text text-' + (result.success ? 'success' : 'danger')">{{ result.msg }}</span>
            </div>
        </div>
        <div v-else class="tickets-container w-100 d-flex justify-content-center align-items-center flex-column">
            <div v-if="tickets.length == 0" class="no-content text-center">
                <img width="300" src="/assets/icons/no-content.png" alt="No Content">
                <h4 style="font-weight: 600; margin: 20px;"> {{t('No Tickets Available')}}</h4>
            </div>
            <div v-else style="width: 80%;" class=" my-4 d-flex flex-column text-white text-start justify-content-center align-items-center">
                    <router-link v-for="ticket in tickets" :key="ticket.id" style="background:linear-gradient(90deg, rgba(242,121,32,1) 57%, rgba(251,180,108,1) 84%);" class="ticket text-start border-1 border-white d-flex flex-row justify-content-around align-items-center rounded-5 text-decoration-none my-2 d-flex p-4 fw-bold" :to="{name:'Ticket', params:{id: ticket.id}}">
                        <ion-icon style="font-size: 2rem; padding: 0 5px;" :icon="icons.mailOutline"></ion-icon>
                        <span class="subject flex-grow-1" style="font-size: 1.2rem;">{{ ticket.subject }}</span>
                        <!-- <span style="background-color: #2F4858" class="align-self-end btn p-2 my-2 text-white rounded-4">View Ticket</span> -->
                        <ion-icon style="font-weight: bold; font-size: 1.2rem;" :icon="icons.chevronForwardOutline"></ion-icon>
                        <!-- <span :class="'status alert alert-'+ status[ticket.status].class ">{{ status[ticket.status].text }}</span> -->
                    </router-link>

            </div>
            <router-link class="addbtn" :to="{name:'NewTickets'}" style="color: var(--color);"> {{t('Send New Message')}} <ion-icon style="vertical-align: middle;" :icon="icons.addCircleOutline"></ion-icon></router-link>
        </div>
    </base-layout>
</template>

<script>
import { ref, onMounted, onUpdated } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { addCircleOutline, chevronForwardOutline, mailOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';
import useToast from '../../composition/useToast';
import { useI18n } from 'vue-i18n';
export default {
  name: 'Tickets',
  components: {
    IonIcon,
  },
  setup() {
    const {t} = useI18n()
    const router = useRouter();
    const { openToast } = useToast();
    const loader = ref(true);
    const tickets = ref([]);
    const icons = { addCircleOutline, chevronForwardOutline, mailOutline };
    const error = ref(false);
    const result = ref({});
    const status = {
      0: { text: t('New'), class: 'primary' },
      1: { text: t('Ongoing'), class: 'warning' },
      2: { text: t('Completed'), class: 'dark' },
    };

    // Check Internet
    if (localStorage.connection == false) {
      openToast(t('You are offline please reconnect and try again'), 'danger', 'bottom');
      return router.go(-1);
    }

    const getTickets = () => {
      axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
      const url = `${process.env.VUE_APP_API_URL}/api/operations/tickets`;
      axios.post(url)
        .then((res) => {
          console.log(res);
          tickets.value = res.data.tickets;
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

    onUpdated(() => {
      setTimeout(() => { loader.value = false; }, 3000);
      error.value = false;
      getTickets();
    });

    return {
      loader,
      tickets,
      icons,
      error,
      result,
      status,
      t
    };
  },
};
</script>

<style scoped>
.ticket
{
    box-sizing: border-box;
    color: #fff;
    width: 90%;
    border: 2px solid #fff;
}
a.addbtn {
    text-decoration: unset;
    text-align: center;
    display: block;
    margin: 20px 0;
    font-size: 20px;
}
.loader {
    text-align: center;
    margin: 10rem auto;
    color: var(--color);
}
.tickets-container{
}

span.status {
    font-size: 15px;
    min-width: 20%;
    text-align: center;
}

.ticket a {
    text-decoration: unset;
    color: unset;
}

</style>
