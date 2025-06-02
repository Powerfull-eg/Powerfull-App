<template>
<base-layout :pageTitle="t('profile.My Profile')" :show-menu-button="false" loading="lazy">
    <div class="page-container">
        <form id="profile-form" @submit.prevent="updateUser">
            <div class="mb-3">
                <img src="/assets/icons/user.png" class="form-icon" width="30">
                <label for="first_name" class="form-label font-weight-bold">{{t('profile.First Name')}}</label>
                <input type="text" class="form-control" id="first_name" name="first_name" :value="userData.first_name">
            </div>
            <div class="mb-3">
                <img src="/assets/icons/group.png" class="form-icon" width="30">
                <label for="last_name" class="form-label font-weight-bold">{{t('profile.Last Name')}}</label>
                <input type="text" class="form-control" id="last_name" :value="userData.last_name" name="last_name">
            </div>
            <div class="mb-3">
                <img src="/assets/icons/email.png" class="form-icon" width="30">
                <label for="email" class="form-label font-weight-bold">{{t("profile.Email")}}</label>
                <input type="email" class="form-control" :value="userData.email ?? ''" id="email" name="email">
            </div>
            <div class="mb-3">
                <img src="/assets/icons/phone.png" class="form-icon" width="30">
                <label for="phone" class="form-label font-weight-bold">{{t("profile.Phone Number")}}</label>
                <input type="number" class="form-control" :value="(userData.phone ? '0' + userData.phone : '')" id="phone" name="phone">
            </div>
            <div class="mb-3">
                <img src="/assets/icons/password.png" class="form-icon" width="30">
                <label for="password" class="form-label font-weight-bold">{{t("profile.Password")}}</label>
                <input type="password" class="form-control" id="password" name="password">
                <span class="text text-white mt-3 mb-5 d-block" style="font-size: 15px;">* {{t("profile.password note")}}.</span>
            </div>
            <div class="submit-container"><button type="submit" class="submit">{{t('Submit')}}</button></div>

        </form>
    </div>
    <!-- Modal -->
    <div class="offcanvas offcanvas-bottom" :is-open="modalOpen" tabindex="-1" id="offcanvasLogin" aria-labelledby="offcanvasBottomLabel">
        <div class="offcanvas-header fs-3">
            <h5 class="offcanvas-title" id="offcanvasBottomLabel">{{ modalData.header }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body small">
            <div v-if="modalData.loader" class="spinner-border" role="status"></div>
            <span v-if="modalData.loader" class="text-center d-block my-3">{{t('Loading')}}...</span>
            <div v-else>
            <img :src="modalData.body.img" alt=""  width='50' class='d-block mx-auto mb-3'>
            <span class='d-block mx-auto fs-4 text-center text' :class="'text-'+modalData.body.textStyle">{{ modalData.body.text }}</span>
            </div>
        </div>
    </div>
</base-layout>
</template>

<script>
import {
  onMounted, onUpdated, ref, watch, watchEffect,
} from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import * as bootstrap from 'bootstrap';
import { json } from 'body-parser';
import { useI18n } from 'vue-i18n';

export default {
  name: 'Profile',
  components: {},
  setup() {
    const { t } = useI18n();
    const modalData = ref({ loader: false, body: { img: '', text: '', textStyle: '' } });
    let offcanvas;
    const userData = ref(JSON.parse(localStorage.userData));

    onMounted(() => {
      offcanvas = new bootstrap.Offcanvas(document.querySelector('#offcanvasLogin'));
    });

    const updateUser = () => {
      const form = document.querySelector('#profile-form');
      const formData = new FormData(form);
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordPattern = /^.{8,}$/;
      const phonepattern = /^(10|11|12|15)\d{8}$/;
      const errMessages = [];

      // Validate data for update
      const requiredData = ['first_name', 'last_name', 'email', 'phone', 'password'];
      const data = {};
      requiredData.map((e) => {
        formData.get(e) !== '' ? data[e] = formData.get(e) : '';
      });
      
      // Remove zero from phone
      data.phone = data.phone ? data.phone.replace(/^0/, '') : '';
      
      // validate data
      if (data.email && !emailPattern.test(data.email)) { 
        errMessages.push(t('validation.Email is not correct')); 
      } else if (data.password && !passwordPattern.test(data.password)) {
         errMessages.push(t("validation.password cant be less than 8 characters")); 
      } else if (data.phone && !phonepattern.test(data.phone) || !data.phone.length) {
          errMessages.push(t('validation.Phone is not correct'));
      } else if (!data.phone && !data.email) {
          errMessages.push(t('validation.You should fill at least one of email and phone')); 
      }
      // Catch errors
      if (errMessages.length) {
        console.log(errMessages);
        modalData.value = { loader: false, body: { img: '/assets/icons/fail.png', text: errMessages[0], textStyle: 'danger' } };
        offcanvas.show();
        setTimeout(() => { offcanvas.hide(); }, 3000);
        return;
      }


      // send data to update
      axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
      const url = `${process.env.VUE_APP_API_URL}/api/operations/update-user`;
      axios.post(url, data)
        .then((res) => {
          console.log(res);
          // update user data
          localStorage.userData = JSON.stringify(res.data);
          userData.value = res.data;
          // watchEffect(() => { userData.value = JSON.parse(localStorage.userData); });
          // show success modal
          modalData.value.loader = true;
          offcanvas.show();
          setTimeout(() => {
            modalData.value = { loader: false, body: { img: '/assets/icons/success.png', text: t('profile.Profile Updated Successfully'), textStyle: 'success' } };
            setTimeout(() => { offcanvas.hide(); }, 3000);
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
          modalData.value = { loader: false, body: { img: '/assets/icons/fail.png', text: t('profile.Failed to update profile Please try again'), textStyle: 'danger' } };
          offcanvas.show();
          setTimeout(() => { offcanvas.hide(); }, 3000);
        });
    };
    return { userData, updateUser, modalData, t };
  },
};
</script>

<style scoped>
.page-container {
    width: 75%;
    margin: 3rem auto 11rem auto;
    text-align: center;
}
#profile-form {
    text-align: start;
    margin: 30px auto;

}
.form-icon {
    margin: 10px;
}

#profile-form > div > input {
    padding: 15px;
    border-radius: 15px;
    box-shadow: #0000005c 2px 6px 2px 2px;
}
#profile-form > div > img {
    background-color: var(--color);
    border-radius: 50%;
    padding: 8px;
}
.submit{
  text-align: center;
    padding: 1rem;
    border-radius: 20px;
    display: block;
    color: unset;
    text-decoration: unset;
    font-size: 1.2rem;
    font-weight: 500;
    width: 75%;
    background: #f27920;
    color: #fff;
    margin: 0 auto;
}
.submit-container{
    bottom: 0;
    left: 0;
    position: fixed;
    width: 100%;
    background-color: var(--background);
    border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
    border-top: 5px solid var(--color);
}
div.spinner-border {
  color: #f68d41;
  margin: 0 auto;
  display: block;
}

#offcanvasLogin{
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
