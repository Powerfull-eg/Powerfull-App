<template>
  <base-layout :show-menu-button="true">
  <div class="form-container text-center">
      <form id="login-form" @submit.prevent="submitForm()">
        <div class="form-inputs d-flex flex-column">
          <ion-input name="email-phone" required v-model="emailPhone" autocomplete label-placement="floating" type="text" placeholder="Email Address or Phone Number"></ion-input>
          <ion-input name="password" required v-model="password" label-placement="floating" type="password" fill="solid" placeholder="Password"></ion-input>
          <div checkbox>
            <ion-checkbox name="terms"></ion-checkbox>
            <p> Remember Me
            </p>
          </div>

          <div class="form-submit">
            <button type="submit">Confirm</button>
          </div>
        </div>
      </form>
      <div class="break-line">
        <span>or</span>
      </div>
      <div class="social">
        <!-- <FacebookLogin /> -->
        <!-- Google -->
        <!-- <GoogleLogin /> -->
        <button class="login-button google" @click="googleLogin"><ion-icon :icon="Icons.logoGoogle"></ion-icon></button>
        <button class="login-button facebook" @click="facebookLogin"><ion-icon :icon="Icons.logoFacebook"></ion-icon></button>
      </div>
    </div>

    <!-- Modal -->
    <div class="offcanvas offcanvas-bottom" :is-open="modalOpen" tabindex="-1" id="offcanvasLogin" aria-labelledby="offcanvasBottomLabel">
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
import { ionInput, ionCheckbox, IonIcon } from '@ionic/vue';
import { logoGoogle, logoFacebook, logoTwitter } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import * as bootstrap from 'bootstrap';
import login from '../composition/login';
// import GoogleLogin from './../components/oatuh/GoogleLogin.vue';
// import FacebookLogin from './../components/oatuh/FacebookLogin.vue'

export default {
  name: 'Login',
  components: {
    ionInput,
    ionCheckbox,
    IonIcon,
  },
  components: {
    // GoogleLogin,
    // FacebookLogin
  },
  setup() {
    const modalData = ref({ body: { img: '', text: '', textStyle: '' } });
    const router = useRouter();
    const Icons = {
      logoGoogle, logoFacebook, logoTwitter,
    };
    let offcanvas;
    onMounted(() => {
      offcanvas = new bootstrap.Offcanvas(document.querySelector('#offcanvasLogin'));
    });

    function submitForm() {
      const form = document.querySelector('.form-container > form#login-form');
      const formData = new FormData(form);
      const data = {
        emailPhone: formData.get('email-phone'),
        password: formData.get('password'),
      };

      console.log(data);

      modalData.value.header = 'Waiting ...';
      modalData.value.loader = true;
      offcanvas.show();

      login(data).then(
        (res) => {
          if (res.status == 'success') {
            // Storing token
            localStorage.setItem('token', JSON.stringify(
              {
                token: res.data.token.access_token,
                tokenType: res.data.token.token_type,
              },
            ));
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
            modalData.value.header = 'Login Succeeded';
            modalData.value.body = { img: '/assets/icons/success.png', text: "Account logged in successfully \n You'll be redirected to home page", textStyle: 'success' };

            setTimeout(() => {
              window.location.href = '/';
            }, 3000);
          } else {
            modalData.value.loader = false;
            modalData.value.header = 'Login Failed';
            modalData.value.body = { img: '/assets/icons/fail.png', text: `Can't login account beacuase : ${res.data}`, textStyle: 'danger' };
          }
        },
      ).catch((err) => {
        modalData.value.loader = false;
        modalData.value.header = 'Login Failed';
        modalData.value.body = { img: '/assets/icons/fail.png', text: `Can't logged in account : ${err}`, textStyle: 'danger' };
      });
    }
    const googleLogin = () => {
      cordova.plugins.GoogleSignInPlugin.signIn(
        (authData) => {
          // {
          //   "status": "success",
          //   "message": {
          //     "id": "",
          //     "display_name": "",
          //     "email": "",
          //     "photo_url": "",
          //     "id_token": ""
          //   }
          // }
          console.log(authData);
        },
        (error) => {
          console.error(error);
        },
      );
    };

    const facebookLogin = () => {

    };

    return {
      Icons,
      submitForm,
      modalData,
      googleLogin,
      facebookLogin,
    };
  },
};
</script>
<style scoped>
    div.form-container{
      margin: 10px  auto;
      text-align: center;
      width: 75%;
    }
    div.form-container > img {
      width: 100px;
      margin: 30px 0;
    }
    div.form-container div.form-inputs > ion-input{
      border: 1px solid var(--main-color-light);
      border-radius: 30px;
      width: 75%;
      margin: 10px auto;
      text-align: start;
      font-size: 12px;
    }
    div.form-container div.form-inputs > div[checkbox] {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0 30px;
    }
    div.form-container div.form-inputs > div[checkbox] > ion-checkbox {
      margin-right: 5px;
    }
    div.form-container div.form-inputs > div[checkbox] > p {
      color: rgb(123 107 107);
      margin-top: 20px;
    }
    ion-checkbox {
    --size: 20px;
    --checkbox-background-checked: var(--main-color-light);
    }

    ion-checkbox::part(container) {
      border-radius: 20px;
      border: 2px solid var(--main-color-light);
    }
    div.form-submit > button{
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
      width: 38%;
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
      margin: 22px;
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
