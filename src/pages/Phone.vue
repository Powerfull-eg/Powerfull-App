<template>
  <base-layout hideHeader hideMenuBtn map>
    <div class="d-flex h-100 bg-white flex-column">
      <div class="w-100 d-flex flex-column justify-content-evenly text-center upper-part"
        style="height: 40%; border-radius: 0px 0px 30% 0px ; background-color:  var(--main-color-light);">
        <div class="phone-logo-con">
          <img class="phone-logo" src="assets/images/white-logo.svg" alt="logo">

        </div>
        <span class="font-weight-bold" style="font-size: 2rem;">{{t('Welcome!')}}</span>

      </div>
      <div class="w-100 h-50 d-flex" style="background-color: var(--main-color-light);">
        <div class="bg-white w-100 h-100 text-dark lower-part" style="height: 107% !important; ">
          <div class="form-container text-center  d-flex flex-column "
            :style="(otpSent && otpVerified && !userExist ? 'margin-top: unset' : '')">
            <form v-if="!otpSent" id="phone-form" @submit.prevent="submitPhone()">
              <div class="form-inputs fs-6 d-flex flex-column">
                <span class=" my-2 text-main-color font-weight-bold">{{ t('phone.Enter your phone number')}}</span>
                <ion-input inputmode="numeric" pattern="[0-9٠-٩]*" name="phone" required v-model="emailphone" autocomplete label-placement="floating"
                  type="number" :placeholder="t('phone.Phone Number')"></ion-input>
                  <!-- <Oauth v-if="settings.oauth.active && settings.oauth.platforms.length > 0" /> -->
                <div class="form-submit">
                  <button id="submit-phone" type="submit">{{t('Confirm')}}</button>
                </div>
                <div class="text-">
                  <router-link to="/guest" class="m-3 text-main-color text-decoration-none font-weight-bold">
                    {{ t("phone.Continue as guest") }} >
                  </router-link>
                </div>
              </div>
            </form>
            <form v-else-if="otpSent && !otpVerified" style="margin-bottom: 2rem;" id="otp" @submit.prevent="verifyOtp()">
              <div style="padding-top: 50px;" class="form-inputs fs-6 d-flex flex-column">
                <span class="m-2">{{emailOtp ? t("phone.Please enter the code that has been sent to this email") : t("phone.Please enter the code that has been sent to this number")}}</span>
                <div class="fs-3 my-2" style="color: var(--main-color-light);">+20{{ phone }}</div>
                <a class="mb-3 text-start text-decoration-none mx-4" @click.prevent="otpSent = false; resetPassword = false;">{{ t('phone.Edit your number')}}</a>
                <div class="otp-input">
                  <ion-input type="text" maxlength=1 inputmode="numeric" pattern="[0-9٠-٩]*" min="0" max="9" required></ion-input>
                  <ion-input type="text" maxlength=1 inputmode="numeric" pattern="[0-9٠-٩]*" min="0" max="9" required></ion-input>
                  <ion-input type="text" maxlength=1 inputmode="numeric" pattern="[0-9٠-٩]*" min="0" max="9" required></ion-input>
                  <ion-input type="text" maxlength=1 inputmode="numeric" pattern="[0-9٠-٩]*" min="0" max="9" required></ion-input>
                </div>
                <div v-if=otpExpired class="d-flex justify-content-between mx-3">
                  <a class="text-primary text-decoration-none" @click.prevent="sendOtp()">{{ t('phone.Send Again')}}</a>
                  <span>{{ t("phone.didnt get code?") }}</span>
                </div>
                <span id="counter" class="text text-danger text-end m-3"></span>
                <span v-if="otpStatus != 0" :class="'otp-status text text-' + (otpStatus === 1 ? 'success' : 'danger')">{{
                  otpStatus === 1 ? t("phone.OTP is correct") : t("phone.OTP is not correct, please try again") }}</span>
                <div class="form-submit">
                  <button type="submit">{{ t("Confirm")}}</button>
                </div>
              </div>
            </form>
            <form v-else-if="otpSent && otpVerified && userExist && !resetPassword" id="old-user"
              @submit.prevent="loginUser()">
              <div class="form-inputs d-flex flex-column">
                <span class="fs-5 my-2" style="color:var(--color);font-weight: 600;">{{ t("Welcome!")}} {{ userName }}</span>
                <span class="fs-6 my-2">{{ t("phone.Enter your Password to login")}}</span>
                <ion-input name="password" required v-model="password" autocomplete label-placement="floating"
                  type="password" placeholder="Password"></ion-input>
                <span><a class="text-primary text-decoration-none" @click.prevent="resetUserPassword()">{{ t('phone.Forget Password ?')}}</a></span>
                <div class="form-submit">
                  <button type="submit">{{ t("Confirm")}}</button>
                </div>
              </div>
            </form>
            <form id="new-user" :style="`direction: ${locale == 'ar' ? 'rtl' : 'ltr'}`" v-else-if="otpSent && otpVerified && !userExist && !resetPassword" class="w-75"
              @submit.prevent="register()">
              <div class="form-inputs d-flex flex-column">
                <br>
                <span class="fs-6 my-2">{{ t('phone.Complete Your Account')}}</span>
                <div class="row">
                  <ion-input class="col me-3" name="fname" required v-model="fname" autocomplete
                    label-placement="floating" type="text" :placeholder="t('profile.First Name')"></ion-input>
                  <ion-input class="col" name="lname" required v-model="lname" autocomplete label-placement="floating"
                    type="text" :placeholder="t('profile.Last Name')"></ion-input>
                </div>

                <ion-input name="email" v-model="email" autocomplete label-placement="floating" type="text"
                  :placeholder="`${t('profile.Email')} (${t('Optional')})`"></ion-input>

                <!-- <div class="row">
                  <ion-input class="col me-3" name="password" required v-model="password" autocomplete
                    label-placement="floating" type="Password" :placeholder="t('profile.Password')"></ion-input>
                  <ion-input class="col" name="confirm" required v-model="confirm" autocomplete label-placement="floating"
                    type="Password" :placeholder="t('profile.Confirm Password')"></ion-input>
                </div> -->
                <div class="row my-3">
                  <div class="form-check form-switch">
                    <input required class="form-check-input" type="checkbox" role="switch" id="terms" name="terms" v-model="terms">
                    <label class="form-check-label" for="terms" style="font-size: 1rem;display: block; width: fit-content; line-height: 2rem;">{{t('Do you accept')}} <router-link to="/terms">{{t('Terms & Conditions')}}</router-link></label>
                  </div>
                </div>
                <div class="form-submit">
                  <button type="submit">{{ t("Confirm")}}</button>
                </div>
              </div>
            </form>
            <!-- Reset Password Form -->
            <form v-else-if="otpSent && otpVerified && userExist && resetPassword" id="reset-password"
              @submit.prevent="submitResetPassword()">
              <div class="form-inputs d-flex flex-column">
                <span class="fs-5 my-2" style="color:var(--color);font-weight: 600;">{{t("Welcome!")}} {{ userName }}</span>
                <span class="fs-6 my-2">{{ t('phone.Enter your new Password')}}</span>
                <ion-input class="col me-3" name="password" required v-model="password" autocomplete
                  label-placement="floating" type="Password" :placeholder="t('profile.Password')"></ion-input>
                <ion-input class="col" name="confirm" required v-model="confirm" autocomplete label-placement="floating"
                  type="Password" :placeholder="t('profile.Confirm Password')"></ion-input>
                <div class="form-submit">
                  <button type="submit">{{ t("Confirm")}}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div class="offcanvas offcanvas-bottom" :is-open="modalOpen" tabindex="-1" id="offcanvasPhone"
      aria-labelledby="offcanvasBottomLabel">
      <div class="offcanvas-header fs-3">
        <h5 class="offcanvas-title" id="offcanvasBottomLabel">{{ modalData.header }}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body small">
        <div v-if="modalData.loader" class="spinner-border" role="status"></div>
        <span v-if="modalData.loader" class="text-center d-block my-3">{{t("Loading")}}...</span>
        <div v-else>
          <img :src="modalData.body.img" alt="" width='50' class='d-block mx-auto mb-3'>
          <span class='d-block mx-auto fs-4 text-center text' :class="'text-' + modalData.body.textStyle">{{
            modalData.body.text }}</span>
        </div>
      </div>
    </div>
  </base-layout>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ionInput, IonIcon } from '@ionic/vue';
import { useRouter } from 'vue-router';
import * as bootstrap from 'bootstrap';
import axios from 'axios';
import { useI18n } from 'vue-i18n';
import NewUser from '../components/phone/NewUser.vue';
import Oauth from '../components/phone/Oauth.vue';
import { useStore } from 'vuex';

export default {
  name: 'Phone',
  components: { ionInput, IonIcon, NewUser, Oauth },
  setup() {
    const { t } = useI18n();
    const modalData = ref({ body: { img: '', text: '', textStyle: '' } });
    const router = useRouter();
    let offcanvas;
    const otpActive = ref(true);
    const otpSent = ref(false);
    const otpVerified = ref(false);
    const otpStatus = ref(0);
    const userExist = ref(false);
    const emailOtp = ref(false);
    const otpExpired = ref(false);
    const resetPassword = ref(false);
    const userName = ref('!');
    const phone = ref('');
    const phonepattern = /^(10|11|12|15)\d{8}$/;
    const store = useStore();
    const settings = ref(store.getters["settings/settings"]);

    onMounted(() => {
      checkOtpActivation();
      offcanvas = new bootstrap.Offcanvas(document.querySelector('#offcanvasPhone'));
    });
    
    const checkOtpActivation = async () => {
      const url = `${process.env.VUE_APP_API_URL}/api/check-otp-activation`;
      await axios.get(url)
      .then(res => { otpActive.value = res.data.otpActive;})
      .catch(err => console.log(err))
    }

    const prepareOtpInputs = () => {

      if (document.querySelector('form#otp') == null) {
        setTimeout(() => prepareOtpInputs(), 2000);
      }
      const inputs = document.querySelectorAll('form#otp .otp-input ion-input input');
      inputs.forEach((input, index) => {
          // add pasted numbers
          input.addEventListener('paste', (e) => {
              e.preventDefault();
              const pasted = e.clipboardData.getData('Text');
              if (pasted.length > 1) {
                  pasted.split('').forEach((char, i) => {
                      if (i < inputs.length) {
                          inputs[i].value = char;
                      }
                      if (i === inputs.length - 1) {
                          input.disabled = true;
                          setTimeout(() => verifyOtp(),1000);
                      }
                  });
              }
          })
          // Add some styles
          input.style.padding = "0px !important"; 
          // move to next input
          input.addEventListener('input', (e) => {
              if (e.target.value.length > 1) {
                  e.target.value = e.target.value.slice(0, 1);
              }
              if (e.target.value.length === 1) {
                  if (index < inputs.length - 1) {
                      inputs[index + 1].focus();
                  }
              }
              // submit on last input
              if (index === inputs.length - 1) {
                      input.disabled = true;
                      setTimeout(() => verifyOtp(),1000);
              }
          });
          // delete and back on backspace
          input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value) {
                    if (index > 0) {
                        inputs[index - 1].focus();
                    }
                }
                if (e.key === 'e') {
                    e.preventDefault();
                }
            });
        });
    }

    const  otpActivation = async () => {
      const url = `${process.env.VUE_APP_API_URL}/api/otp-activation`;
      await axios.post(url,{phone:phone.value})
              .then(res => {
                console.log(res);
                if(!res.data.otpActive){
                  otpSent.value = true;
                  otpVerified.value = true;
                  otpActive.value = false;
                } else {
                  prepareOtpInputs();
                }
                userExist.value = res.data.UserExist;
                userName.value  = res.data.UserExist ? res.data.name : '';
              })
              .catch(err => console.log(err))
    }
    const submitPhone = () => {

      // Prevent multiple clicks
      const submitBtn = document.querySelector('#submit-phone');
      if(submitBtn){
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = t('Confirm');
        }, 3000);
      }

      const form = document.querySelector('.form-container > form#phone-form');
      const formData = new FormData(form);
      phone.value = formData.get('phone').substring(1);
      
      // check if input isn't empty
      if (phone.value === 0 || !phonepattern.test(phone.value)) {
        modalData.value.loader = false;
        modalData.value.header = t('phone.Phone not correct');
        modalData.value.body = { img: '/assets/icons/fail.png', text: t('phone.Please enter valid phone number'), textStyle: 'danger' };
        offcanvas.show();
        return;
      }

      sendOtp();
      otpActivation();
    };
    const sendOtp = () => {
      const inputs = document.querySelectorAll('form#otp .otp-input input');
      inputs.forEach(input => {
                      input.value = '';
                      input.disabled = false;
                  });
      const type = emailOtp.value ? "email" : "phone";
      const url = `${process.env.VUE_APP_API_URL}/api/otp`;
      axios.post(url, { phone: phone.value, type })
        .then((res) => {
          console.log(res);
          modalData.value.header = t('Waiting ...');
          modalData.value.loader = true;
          offcanvas.show();
          setCounter();
          setTimeout(() => { otpSent.value = true; offcanvas.hide();}, 2000);
        })
        .catch((err) => {
          modalData.value.loader = false;
          modalData.value.header = t('Something went wrong');
          modalData.value.body = { img: '/assets/icons/fail.png', text: t('phone.failed to send otp please check your number and try again'), textStyle: 'danger' };
          offcanvas.show();
          resetPassword.value = false;
        });
    }
    const  verifyOtp = async () => {
      countdown != null ? clearInterval(countdown) : '';

      const submitBtn = document.querySelector('form#otp .form-submit button');
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
      submitBtn.disabled = true;
      const form = document.querySelector('.form-container > form#otp');
      const formData = new FormData(form);
      const inputs = document.querySelectorAll('form#otp .otp-input input');
      const otp = Array.from(inputs).map(input => input.value).join('');
      inputs.forEach(input => {
                      input.value = '';
                      input.disabled = false;
                  });

      const url = `${process.env.VUE_APP_API_URL}/api/check-otp`;
      await axios.post(url, { phone: phone.value, otp })
        .then((res) => {
          console.log(res);
          otpVerified.value = true;
          userName.value = res.status == 200 ? res.data.name : '!';
          otpStatus.value = 1;
          modalData.value.header = t('Waiting ...');
          modalData.value.loader = true;
          offcanvas.show();

          setTimeout(() => {
            userExist.value = res.status == 200;
            if(userExist.value && !resetPassword.value){
              loginUser();
              otpSent.value = false;
              otpVerified.value = false;
              otpStatus.value = 0;
              return;
            }
            offcanvas.hide();
          }, 2000);
        })
        .catch((err) => { console.log(err); otpVerified.value = false; otpStatus.value = 2; });
        submitBtn.innerHTML = t('Confirm');
        submitBtn.disabled = false;
    };

    const loginUser = () => {
      modalData.value.header = t('Waiting ...');
      modalData.value.loader = true;
      offcanvas.show();

      const form = document.querySelector('.form-container > form#old-user');
      const formData = new FormData(form);
      const password = formData.get('password');
      const url = `${process.env.VUE_APP_API_URL}/api/loginNew`;

      axios.post(url, { phone: phone.value, password })
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
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
            modalData.value.header = t("Login Succeeded");
            modalData.value.body = { img: '/assets/icons/success.png', text: t("phone.Account logged in successfully Youll be redirected to home page"), textStyle: 'success' };

            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
          } else {
            modalData.value.loader = false;
            modalData.value.header = t("Login Failed");
            modalData.value.body = { img: '/assets/icons/fail.png', text: t("phone.cant login account, please try again"), textStyle: 'danger' };
          }

          setTimeout(() => { offcanvas.hide(); }, 3000);
        })
        .catch((err) => {
          console.log(err);
          modalData.value.loader = false;
          modalData.value.header = t('Login Failed');
          modalData.value.body = { img: '/assets/icons/fail.png', text: t("phone.cant login account, please try again"), textStyle: 'danger' };
          setTimeout(() => { offcanvas.hide(); }, 3000);
        });
    };

    const register = async () => {
      offcanvas = new bootstrap.Offcanvas(document.querySelector('#offcanvasPhone'));

      const passwordPattern = /^.{8,}$/;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const requiredValues = ['fname', 'lname', 'phone'];
      const data = {};
      const inputs = ['fname', 'lname', 'email', 'phone'];
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
        errMessages.push(t('validation.The entered Email isnt correct'));
        console.log(errMessages);
      }

      // Validate password
      // if (!passwordPattern.test(data.password)) {
      //   errMessages.push(t('validation.The Minimum length of password should be 8 characters'));
      // }

      // if (data.password !== data.confirm) {
      //   errMessages.push(t('validation.the password and confirm password not identical'));
      // }

      if (data.email && !errMessages.length) {
        // Check Email
        const url = `${process.env.VUE_APP_API_URL}/api/checkemail`;
        await axios.post(url, { email: data.email })
          .then((response) => {
            if (response.data == 1) {
              errMessages.push(t('validation.Email address is already exist'));
            }
          })
          .catch((error) => {
            errMessages.push(t('validation.Failed to connect the server, Please try agian'));
          });
      }

      // Check Phone
      if (data.phone && !errMessages.length) {
        const url = `${process.env.VUE_APP_API_URL}/api/checkphone`;
        await axios.post(url, { phone: data.phone })
          .then((response) => {
            if (response.data == 1) {
              errMessages.push('Phone number is already exist');
            }
          })
          .catch((error) => {
            errMessages.push('Failed to connect the server, Please try agian');
          });
      }
      // stoping from sending register request
      if (errMessages.length) {
        modalData.value.loader = false;
        modalData.value.header = t("validation.Cant register account");
        modalData.value.body = { img: '/assets/icons/fail.png', text: `${errMessages[0]}`, textStyle: 'danger' };
        offcanvas.show();
        return;
      }

      modalData.value.header = t('Waiting ...');
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
                id: res.data.original.user.id,
                first_name: res.data.original.user.first_name,
                last_name: res.data.original.user.last_name,
                email: res.data.original.user.email,
                phone: res.data.original.user.phone,
                photo: res.data.original.user.photo,
                cards: res.data.original.user.cards,
              },
            ));

            modalData.value.loader = false;
            modalData.value.header = t('phone.Registration Succeeded');
            modalData.value.body = { img: '/assets/icons/success.png', text:t("phone.Account registered successfully Youll be redirected to home page"), textStyle: 'success' };
            setTimeout(() => { window.location.href = '/'; }, 3000);
          } else {
            console.log('res', res);

            modalData.value.loader = false;
            modalData.value.header = 'Registration Failed';
            modalData.value.body = { img: '/assets/icons/fail.png', text: t("phone.Cant register account beacuase ,please try again"), textStyle: 'danger' };
          }
        })
        .catch((err) => {
          console.log('err', err);

          modalData.value.loader = false;
          modalData.value.header = 'Registration Failed';
          modalData.value.body = { img: '/assets/icons/fail.png', text: t("phone.Cant register account beacuase ,please try again"), textStyle: 'danger' };
        });
    };

    let countdown;
    const setCounter = () => {
      countdown != null ? clearInterval(countdown) : '';
      const countdownDuration =  60 * 1000;
      const startTime = new Date().getTime();
      countdown = setInterval(() => {
        const currentTime = new Date().getTime();
        const remainingTime = countdownDuration - (currentTime - startTime);
        otpExpired.value = remainingTime <= 0;
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        // Check if the countdown is finished
        if (remainingTime <= 0) {
          clearInterval(countdown);
          console.log('Countdown finished!');
          document.querySelector('#counter').innerHTML = t('phone.The otp has been expired');
          return;
        }
        // Display the remaining time
        document.querySelector('#counter').innerHTML = `${t('phone.Resend OTP in')} ${minutes}:${(seconds > 9 ? seconds : `0${seconds}`)}`;
      }, 1000);
    };
    const resetUserPassword = () => {
      otpSent.value = false;
      otpVerified.value = false;
      otpStatus.value = 0;
      emailOtp.value = true;
      sendOtp("email");
      resetPassword.value = true;
    }
    const submitResetPassword = () => {
      offcanvas = new bootstrap.Offcanvas(document.querySelector('#offcanvasPhone'));

      const passwordPattern = /^.{8,}$/;
      const requiredValues = ['password', 'confirm'];
      const data = {};
      const errMessages = [];

      const formData = new FormData(document.querySelector('form#reset-password'));
      data["password"] = formData.get("password");
      data["confirm"] = formData.get("confirm");
      data.phone = phone.value;
      // check if required data is exist
      requiredValues.map((value) => {
        if (data[value] === 'undefined' || data[value] === 'null') {
          errMessages.push(`${value} shouldn't be empty`);
        }
      });

      // Validate password
      if (!passwordPattern.test(data.password)) {
        errMessages.push(t('validation.The Minimum length of password should be 8 characters'));
      }

      if (data.password !== data.confirm) {
        errMessages.push(t('validation.the password and confirm password not identical'));
      }

      // stoping from sending reset request
      if (errMessages.length) {
        modalData.value.loader = false;
        modalData.value.header = t('validation.Can\'t register account');
        modalData.value.body = { img: '/assets/icons/fail.png', text: `${errMessages[0]}`, textStyle: 'danger' };
        offcanvas.show();
        return;
      }

      modalData.value.header = t('Waiting ...');
      modalData.value.loader = true;
      offcanvas.show();

      const url = `${process.env.VUE_APP_API_URL}/api/reset-password`;
      axios.post(url, data)
        .then(res => {
          console.log(res);
          // Login user 
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
          modalData.value.header = t('Login Succeeded');
          modalData.value.body = { img: '/assets/icons/success.png', text: t("phone.Your Password has been reset successfully"), textStyle: 'success' };

          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        })
        .catch(err => console.log(err))
    }

    const locale = localStorage.locale;
    return {
      modalData,
      submitPhone,
      sendOtp,
      verifyOtp,
      otpSent,
      otpVerified,
      otpStatus,
      userExist,
      loginUser,
      userName,
      phone,
      register,
      resetPassword,
      resetUserPassword,
      submitResetPassword,
      t,
      locale,
      emailOtp,
      otpExpired,
      settings
    };
  },
};
</script>

<style scoped>
/* @import url('https://fonts.googleapis.com/css2?family=Merriweather&family=Merriweather+Sans:wght@400;700&family=Noto+Sans:wght@300;400;500&family=Rubik:wght@300;400;500&display=swap'); */

/* @media screen and (max-width: 600px) { */

  span,
  button,
  input,
  h1,
  h2 {
    * {
      font-size: 1.2rem;
    }

    /* font-family: 'Noto Sans',
    sans-serif; */
  }

  .icons>img {
    width: 50px;
    margin: 20px;
  }

  .lower-part {
    clip-path: polygon(0 25%, 16% 0, 100% 0, 200% 100%, 0 100%);
  }

  /* New user Form */
  /* form#new-user div.form-container{
  margin: 10px  auto;
  text-align: center;
  width: 75%;
  margin-top: 35%;
}
form#new-user div.form-container > img {
  width: 100px;
  margin: 30px 0;
} */
  form#new-user div.form-inputs ion-input {
    background-color: rgb(238, 238, 238);
    border-radius: 20px;
    padding: 5px !important;
    margin: 5px auto;
    text-align: start;
    font-size: 1rem;
  }

  form#new-user div.form-submit>button {
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

  /* another forms */
  div.form-submit>button {
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
    /* box-shadow: var(--main-color-light) 1px 4px 15px; */
    margin: 10px;
    width: 200px;
  }

  div.form-container div.form-inputs>ion-input {
    background-color: rgb(238, 238, 238);
    border-radius: 10px;
    width: 80%;
    padding: 10px !important;
    height: 60px;
    margin: 10px auto;
    text-align: start;
    font-size: 1.3rem;
  }

  .phone-logo {
    width: 70%;
  }

  .otp-input {
      display: flex;
      justify-content: center;
      margin-bottom: 2rem;
  }
  .otp-input ion-input {
      width: 35px;
      max-width: 35px;
      height: 45px;
      margin: 0 8px;
      text-align: center;
      font-size: 1.5rem;
      border: 2px solid grey;
      border-radius: 10px;
      color: var(--main-color);
      transition: all 0.3s ease;
      --padding-start: 0;
      --padding-end: 0;
      --padding-top: 0;
      --padding-bottom: 0;
  }
  .otp-input ion-input:focus-within {
      border-width: 3px;
      box-shadow: 0 0 0 2px #000;
      outline: none;
  }
  .otp-input ion-input::-webkit-outer-spin-button,
  .otp-input ion-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
  }
  .otp-input ion-input[type=number] {
      -moz-appearance: textfield;
  }

.text-main-color {
  color: var(--main-color-light);
}

div.form-container {
  margin: 5% auto 0 auto;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  height: 100%;
  font-size: 1.5rem;
}

div.form-container>img {
  width: 100px;
  margin: 30px 0;
}

/* Spinner */
div.spinner-border {
  color: var(--background);
  margin: 0 auto;
  display: block;
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

/* Modal */
#offcanvasPhone {
  --bs-offcanvas-height: 55%;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  border-top: 5px solid #f68d41;
  padding: 0 10px;
}

.offcanvas-header {
  padding: 20px 20px 0 0;
}

.offcanvas-body {
  padding: 0;
  padding-top: 30px;
}


/* Ipad pro*/
@media screen and (min-width: 550px) {
  .phone-logo {
    width: 40%;
  }
}
</style>