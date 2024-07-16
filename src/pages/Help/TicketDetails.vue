<template>
<base-layout convertHeaderBg  :show-menu-button="false">
    <div v-if="loader || error" >
        <div v-if="loader" class="loader">
            <div  class="spinner-border" role="status"></div>
            <span class="text-center d-block my-3">Loading...</span>
        </div>
        <div v-else class="result my-5">
            <img :src="result.img" style="display: block; margin: 0 auto" width="100" alt="">
            <span :class="'mt-3 d-block text-center fs-5 text text-' + (result.success ? 'success' : 'danger')">{{ result.msg }}</span>
        </div>
    </div>
    <div v-else class="ticket-container row my-5">
        <h3 class="subject text-center alert alert-warning w-75 mx-auto">{{ ticket.subject }}</h3>
        <div class="messages d-flex flex-column" style="margin-bottom: 7rem;">
            <div class="message w-50 mx-5 mt-2" :class="(message.sender == 1 ? 'align-self-end text-end' : 'align-self-start text-start')" v-for="message in ticket.messages" :key="message.id">
                <span :class="(message.sender == 1 ? 'user' : 'admin')">{{ message.message }}</span>
            </div>
        </div>
    <div class="w-100 bg-white position-fixed d-flex flex-row w-100" style="bottom:0;">
        <div class="form-container mt-1 position-relative w-100">
            <form @submit.prevent="submitForm" style="height: 100px;" class="d-flex flex-row justify-content-center align-items-center w-100" id="reply" >
                <div class="form-floating w-100 flex-grow-1">
                    <input class="form-control h-100" name="message" v-model="message" placeholder="Leave a Message here" id="floatingTextarea2" />
                </div>
                <div class="submit ">
                    <button type="submit" class="btn bg-transparent btn-light w-100 h-100"><ion-icon style="font-size: 20px;font-weight: 700;vertical-align: middle;" :icon="Icons.paperPlaneOutline"></ion-icon></button>
                </div>
            </form>
        </div>
    </div>
    </div>
</base-layout>
</template>

<script>
import { ref, onMounted, onUpdated } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { paperPlaneOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';
import useToast from '../../composition/useToast';

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
    const ticket = ref({});
    const error = ref(false);
    const result = ref({});
    const Icons = { paperPlaneOutline };

    // Check Internet
    if (localStorage.connection == false) {
      openToast('You are offline please reconnect and try again', 'danger', 'bottom');
      return router.go(-1);
    }

    // Get Ticket Data
    const getTicket = () => {
      axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
      const url = `${process.env.VUE_APP_API_URL}/api/operations/ticket/${route.params.id}`;
      axios.post(url)
        .then((res) => {
          console.log(res);
          ticket.value = res.data.ticket[0];
          setTimeout(() => { loader.value = false; }, 3000);
        })
        .catch((err) => {
          console.log(err);
          result.value = {
            img: '/assets/icons/fail.png',
            success: false,
            msg: 'Something went wrong \n Please try again',
          };
          error.value = true;
          setTimeout(() => { loader.value = false; }, 3000);
        });
    };

    function submitForm() {
      const message = document.querySelector('input#floatingTextarea2');
      if (!message.value) { return console.log('you should entereg a message'); }

      const node = document.querySelector('.message').cloneNode(true);

      node.firstChild.innerHTML = message.value;

      // <span class="d-block fs-6">sending</span>
      const status = document.createElement('SPAN');
      status.classList.add('d-block');
      status.classList.add('fs-6');
      status.classList.add('message-status');
      status.innerHTML = 'sending';

      node.appendChild(status);

      document.querySelector('.messages').appendChild(node);

      // Scroll to last message
      const messages = document.querySelectorAll('.message');
      messages[messages.length - 1].scrollIntoView({ behavior: 'smooth' });

      // axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.token).token}`;
      const url = `${process.env.VUE_APP_API_URL}/api/operations/add-message`;
      const statusElements = document.querySelectorAll('.message-status');
      axios.post(url, { id: route.params.id, message: message.value })
        .then((res) => {
          console.log(res);
          statusElements[statusElements.length - 1].innerHTML = 'Sent';
        })
        .catch((err) => {
          console.log(err);
          statusElements[statusElements.length - 1].innerHTML = 'Failed';
        });
      message.value = '';
    }

    onUpdated(() => {
      setTimeout(() => { loader.value = false; }, 3000);
      error.value = false;
      getTicket();
      setTimeout(() => {
        const messages = document.querySelectorAll('.message');
        messages[messages.length - 1].scrollIntoView({ behavior: 'smooth' });
      }, 3500);
    });

    const messageInterval = setInterval(getTicket(), 5000);

    return {
      loader,
      ticket,
      error,
      result,
      Icons,
      submitForm,
    };
  },
};
</script>

<style scoped>

.loader {
    text-align: center;
    margin: 10rem auto;
    color: var(--main-color-light);
    background: var(--color) !important;
}
.spinner-border {
  color: var(--main-color-light);
  margin: 0 auto;
  display: block;
}
span.user {
    padding: 13px;
    background: linear-gradient(265deg, rgb(220 115 37) 37%, rgba(229,136,31,1) 74%);
    border-radius: 30px;
    color: #fff;
    font-size: 18px;
    display: inline-block;
}
span.admin {
    padding: 13px;
    background: #ddd;
    border-radius: 30px;
    font-size: 18px;
    display: inline-block;
    color: #000;
}
.form-container {
    z-index: 100;
    background: inherit;
    margin: 10px 0;
    margin-left: 5px;
    box-sizing: border-box;
}
.submit {
    width: 20%;
    height: 100%;
    flex-grow: 0;
}

.form-container input#floatingTextarea2 {
    border-color: #f68d41;
    border-width: 3px;
}
</style>
