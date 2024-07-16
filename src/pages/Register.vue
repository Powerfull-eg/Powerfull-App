<template>
  <base-layout :show-menu-button="true">

    <div class="register-form text-center">
      <form id="register-form" @submit.prevent="submitForm()">
        <div class="form-inputs d-flex flex-column">
                <div class="d-flex">
                  <ion-input name="fname" required v-model="fname" style="margin: 10px;" label-placement="floating" fill="solid" placeholder="First Name"></ion-input>
                  <ion-input name="lname" required v-model="lname" style="margin: 10px;" label-placement="floating" fill="solid" placeholder="Last Name"></ion-input>

                </div>
                <ion-input name="email" required v-model="email" autocomplete label-placement="floating" type="email" placeholder="Email Address"></ion-input>
                <ion-input name="phone" required v-model="phone" autocomplete label-placement="floating" type="number" placeholder="Phone Number"></ion-input>
                <ion-input name="password" required v-model="password" autocomplete label-placement="floating" type="password" placeholder="Password"></ion-input>
                <ion-input name="confirm" required v-model="confirm" autocomplete label-placement="floating" type="password" placeholder="Confirm Password"></ion-input>
                <div checkbox>
                  <ion-checkbox required name="terms"></ion-checkbox>
                  <p> I agree to the
                    <router-link :to="{name: 'terms'}">
                      terms and conditions
                    </router-link>
                  </p>
                </div>
                <div class="name-submit">
                  <button type="submit">Sign Up</button>
                </div>
            </div>
      </form>
      <div class="break-line">
        <span>or</span>
      </div>
      <div class="social">
        <button class="login-button facebook"><ion-icon :icon="Icons.logoFacebook"></ion-icon></button>
        <button class="login-button google"><ion-icon :icon="Icons.logoGoogle"></ion-icon></button>
        <button class="login-button twitter"><ion-icon :icon="Icons.logoTwitter"></ion-icon></button>
      </div>
    </div>

      <!-- Modal -->
      <div class="offcanvas offcanvas-bottom" :is-open="modalOpen" tabindex="-1" id="offcanvasregister" aria-labelledby="offcanvasBottomLabel">
      <div class="offcanvas-header fs-3">
        <h5 class="offcanvas-title" id="offcanvasBottomLabel">{{ modalData.header }}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body small">
        <div v-if="modalData.loader" class="spinner-border" role="status"></div>
        <span v-if="modalData.loader" class="text-center d-block my-3">Loading...</span>
        <div v-else>
          <img :src="modalData.body.img" alt=""  width='50' class='d-block mx-auto mb-3'>
          <span class='d-block mx-auto fs-4 text-center text' :class="'text-'+modalData.body.textStyle">{{ modalData.body.text }}</span>
        </div>
      </div>

    </div>
  </base-layout>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { IonInput, IonCheckbox, IonIcon } from '@ionic/vue';
import { logoGoogle, logoFacebook, logoTwitter } from 'ionicons/icons';
import * as bootstrap from 'bootstrap';
import { useRouter, useRoute } from 'vue-router';
import register from '../composition/register';
import Button from '../components/Button.vue';

export default {
  name: 'Register',
  components: {
    Button,
    IonInput,
    IonCheckbox,
    IonIcon,
  },
  setup() {
    const code = ref('+20');
    const modalData = ref({ body: { img: '', text: '', textStyle: '' } });
    const router = useRouter();
    let offcanvas;
    onMounted(() => {
      offcanvas = new bootstrap.Offcanvas(document.querySelector('#offcanvasregister'));
    });
    function submitForm() {
      const form = document.querySelector('.register-form > form#register-form');
      const formData = new FormData(form);
      const data = {};
      const inputs = ['fname', 'lname', 'email', 'phone', 'password', 'confirm'];
      inputs.map((value, index) => {
        data[value] = formData.get(value);
      });
      modalData.value.header = 'Waiting ...';
      modalData.value.loader = true;
      offcanvas.show();

      register(data).then(
        (res) => {
          if (res.status == 'success') {
            localStorage.setItem('token', JSON.stringify(
              {
                token: res.data.token.access_token,
                tokenType: res.data.token.token_type,
              },
            ));
            console.log(res);
            // Storing User Data
            localStorage.setItem('userData', JSON.stringify(
              {
                id: res.data.user.id,
                first_name: res.data.user.first_name,
                last_name: res.data.user.last_name,
                email: res.data.user.email,
                phone: res.data.user.phone,
                photo: res.data.user.photo,
                cards: res.data.user.cards,
              },
            ));

            modalData.value.loader = false;
            modalData.value.header = 'Registration Succeeded';
            modalData.value.body = { img: '/assets/icons/success.png', text: "Account registered successfully \n You'll be redirected to home page", textStyle: 'success' };
            setTimeout(() => {
              window.location.href = '/';
            }, 3000);
          } else {
            console.log('res', res);

            modalData.value.loader = false;
            modalData.value.header = 'Registration Failed';
            modalData.value.body = { img: '/assets/icons/fail.png', text: `Cant register account beacuase : ${res.data}`, textStyle: 'danger' };
          }
        },
      ).catch((err) => {
        console.log('err', err);

        modalData.value.loader = false;
        modalData.value.header = 'Registration Failed';
        modalData.value.body = { img: '/assets/icons/fail.png', text: `Cant register account : ${err}`, textStyle: 'danger' };
      });
    }

    const Icons = {
      logoGoogle, logoFacebook, logoTwitter,
    };

    onUnmounted(() => {
      offcanvas.hide();
    });

    return {
      Icons,
      submitForm,
      modalData,
    };
  },
};
</script>

<style scoped>
    div.register-form {
        text-align: center;
    }
    div.register-form{
      margin-top: 15px;
      font-size: 15px;
    }
    div.register-form div.form-inputs > ion-input,div.register-form div.form-inputs > div > ion-input{
      border: 1px solid var(--main-color-light);
      border-radius: 30px;
      width: 75%;
      margin: 10px auto;
      text-align: start;
      font-size: 12px;

    }
    div.register-form div.form-inputs > div[checkbox] {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0 55px;
    }
    div.register-form div.form-inputs > div[checkbox] > ion-checkbox {
      margin-right: 5px;
    }
    div.register-form div.form-inputs > div[checkbox] > p {
      color: rgb(123 107 107);
        font-size: 14px;
        margin: 12px;
    }

    ion-checkbox {
    --size: 32px;
    --checkbox-background-checked: var(--main-color-light);
    }

    ion-checkbox::part(container) {
      border-radius: 32px;
      border: 2px solid var(--main-color-light);
    }
    div.name-submit > button{
        background-color: var(--main-color-light);
        color: #fff;
        border: 1px solid var(--main-color-light);
        padding: 10px 50px;
        border-radius: 30px;
        box-shadow: var(--main-color-light) 1px 4px 15px;
        margin: 10px;
    }

    /* Break line */

    .break-line {
      position: relative;
      text-align: center;
      margin: 20px 0;
    }

    .break-line::before,
    .break-line::after {
      content: "";
      position: absolute;
      top: 60%;
      width: 40%;
      height: 1px;
      background-color: black;
    }

    .break-line::before {
      right: 5%;
    }

    .break-line::after {
      left: 5%;
    }

    .break-line span {
      position: relative;
      padding: 5px 10px;
      background-color: white;
      border: 2px solid #ddd;
      color: #7d7a7a;
    }

    /* Logging Buttons */
    .login-button {
      display: inline-block;
      padding: 8px;
      border-radius: 50px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      cursor: pointer;
      margin: 10px;
      width: 22px;
    }

    .facebook {
      background-color: #3b5998;
      color: white;
    }

    .google {
      background-color: #db4a39;
      color: white;
    }

    .twitter {
      background-color: #1da1f2;
      color: white;
    }

    div.spinner-border {
      color: #f68d41;
      margin: 0 auto;
      display: block;
    }

    #offcanvasregister{
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
