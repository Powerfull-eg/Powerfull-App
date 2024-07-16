<template>
    <!-- v-else-if="otpSent && otpVerified && !userExist" -->
    <form id="new-user" class="w-75" @submit.prevent="register()">
        <div class="form-inputs d-flex flex-column">
        <span class="fs-5 my-2" style="color:var(--background); font-weight: 600;">Welcome !</span>
        <span class="fs-6 my-2">Complete Your Account</span>
        <div class="row">
          <ion-input class="col me-3" name="fname" required v-model="fname" autocomplete label-placement="floating" type="text" placeholder="First Name"></ion-input>
          <ion-input class="col" name="lname" required v-model="lname" autocomplete label-placement="floating" type="text" placeholder="Last Name"></ion-input>
        </div>

        <ion-input name="email" v-model="email" required autocomplete label-placement="floating" type="text" placeholder="Email"></ion-input>

        <div class="row">
          <ion-input class="col me-3" name="password" required v-model="password" autocomplete label-placement="floating" type="Password" placeholder="Password"></ion-input>
          <ion-input class="col" name="confirm" required v-model="confirm" autocomplete label-placement="floating" type="Password" placeholder="Confirm Password"></ion-input>
        </div>

        <div class="form-submit">
            <button type="submit">Confirm</button>
        </div>
        </div>
    </form>
                      <!-- Modal -->
        <div class="offcanvas offcanvas-bottom" :is-open="modalOpen" tabindex="-1" id="offcanvasNewUser" aria-labelledby="offcanvasBottomLabel">
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
</template>

<script>
import * as bootstrap from 'bootstrap';
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'NewUser',
  props: ['phone'],

  setup(props) {
    const modalData = ref({ body: { img: '', text: '', textStyle: '' } });
    let offcanvas;
    const register = async () => {
      offcanvas = new bootstrap.Offcanvas(document.querySelector('#offcanvasNewUser'));

      const passwordPattern = /^.{8,}$/;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const requiredValues = ['fname', 'lname', 'email', 'phone', 'password', 'confirm'];
      const data = {};
      const inputs = ['fname', 'lname', 'email', 'phone', 'password', 'confirm'];
      const errMessages = [];

      const formData = new FormData(document.querySelector('form#new-user'));
      inputs.map((value, index) => {
        data[value] = formData.get(value);
      });
      data.phone = phone.value;
      // check if required data is exist
      requiredValues.map((value) => {
        if (data[value] === 'undefined' || data[value] === 'null') {
          errMessages.push(`${value} shouldn't be empty`);
        }
      });

      // validate email
      if (data.email && !emailPattern.test(data.email)) {
        errMessages.push('The entered Email isnt correct');
        console.log(errMessages);
      }

      // Validate password
      if (!passwordPattern.test(data.password)) {
        errMessages.push('The Minimum length of password should be 8 characters');
      }

      if (data.password !== data.confirm) {
        errMessages.push('the password and confirm password not identical');
      }

      if (data.email && !errMessages.length) {
        // Check Email
        const url = `${process.env.VUE_APP_API_URL}/api/checkemail`;
        await axios.post(url, { email: data.email })
          .then((response) => {
            if (response.data == 1) {
              errMessages.push('Email address is already exist');
            }
          })
          .catch((error) => {
            errMessages.push('Failed to connect the server, Please try agian');
          });
      }
      // stoping from sending register request
      if (errMessages.length) {
        modalData.value.loader = false;
        modalData.value.header = 'Can\'t register account';
        modalData.value.body = { img: '/assets/icons/fail.png', text: `${errMessages[0]}`, textStyle: 'danger' };
        offcanvas.show();
        return;
      }

      modalData.value.header = 'Waiting ...';
      modalData.value.loader = true;
      offcanvas.show();

      const url = `${process.env.VUE_APP_API_URL}/api/register`;
      await axios.post(url, data)
        .then((res) => {
          if (res.status == 200) {
            localStorage.setItem('token', JSON.stringify(
              {
                token: res.data.original.token.access_token,
                tokenType: res.data.original.token.token_type,
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
            setTimeout(() => { window.location.href = '/'; }, 3000);
          } else {
            console.log('res', res);

            modalData.value.loader = false;
            modalData.value.header = 'Registration Failed';
            modalData.value.body = { img: '/assets/icons/fail.png', text: 'Can\'t register account beacuase ,please try again', textStyle: 'danger' };
          }
        })
        .catch((err) => {
          console.log('err', err);

          modalData.value.loader = false;
          modalData.value.header = 'Registration Failed';
          modalData.value.body = { img: '/assets/icons/fail.png', text: 'Can\'t register account ,please try again', textStyle: 'danger' };
        });
    };

    return { register, modalData };
  },
};
</script>

<style scoped>
form#new-user div.form-container{
  margin: 10px  auto;
  text-align: center;
  width: 75%;
  margin-top: 35%;
}
form#new-user div.form-container > img {
  width: 100px;
  margin: 30px 0;
}
form#new-user div.form-container div.form-inputs  ion-input{
  background-color: rgb(238, 238, 238);
  border-radius: 20px;
  padding: 5px !important;
  margin: 5px auto;
  text-align: start;
  font-size: 1rem;
}

form#new-user div.form-submit > button{
  /* font-family: 'Merriweather', serif;
  font-family: 'Merriweather Sans', sans-serif;
  font-family: 'Rubik', sans-serif; */
  background-color: var(--main-color-light);
  color: #fff;
  border: 1px solid;
  border-color: var(--color);
  padding: 10px 50px;
  border-radius: 25px;
  font-size: 1.5rem;
  box-shadow: var(--main-color-light) 1px 4px 15px;
  margin: 10px;
  width: 200px;
}

    /* Modal */
  #offcanvasNewUser{
        --bs-offcanvas-height: 55%;
        border-top-left-radius: 40px;
        border-top-right-radius: 40px;
        border-top: 5px solid #f68d41;
        padding: 0 10px;
        z-index: 1000;
    }
    .offcanvas-header{
        padding: 20px 20px 0 0;
    }
    .offcanvas-body{
        padding: 0;
        padding-top: 30px;
    }
</style>
