<template>
    <!-- Or -->
    <div class="or">
        <span class="line"></span>
        <span class="text">OR</span>
        <span class="line"></span>
    </div>

    <!-- Social Icons -->
    <div class="social-icons">
        <ion-icon @click="oauthLogin('google')" v-if="checkPlatformActive('google')" style="color: #e90b0b" :icon="Icons.logoGoogle"></ion-icon>
        <ion-icon @click="oauthLogin('facebook')" v-if="checkPlatformActive('facebook')"  style="color: #0b65e9" :icon="Icons.logoFacebook"></ion-icon>
        <ion-icon @click="oauthLogin('twitter')" v-if="checkPlatformActive('twitter')"  style="color: #1DA1F2" :icon="Icons.logoTwitter"></ion-icon>
    </div>

    <!-- Alerts -->
        <!-- Request Phone Alert -->
        <ion-alert :is-open="showRequestPhoneAlert"
            trigger="present-alert"
            :header="alertHeader"
            :buttons="alertButtons"
            :inputs="alertInputs"
        ></ion-alert>
</template>

<script>
import { logoGoogle, logoFacebook, logoTwitter  } from 'ionicons/icons';
import {useI18n} from 'vue-i18n';
import { ref } from 'vue';
import axios from 'axios';
import useToast from '../../composition/useToast';
import { useStore } from 'vuex';
import { IonIcon, IonAlert, loadingController } from '@ionic/vue';

export default {
    name: "Oauth",
    components: {
        IonIcon,
        IonAlert
    },

    setup() {
        const { t } = useI18n();
        const loaderDone = ref(false);
        const { openToast } = useToast();
        const store = useStore();
        const settings = ref(store.getters["settings/settings"]);
        const token = ref(null);
        const selectedPlatform = ref(null);
        const phone = ref(null);
        const otp = ref(null);
        const showRequestPhoneAlert = ref(false);
        const alertHeader = ref('');
        const alertButtons = ref([]);
        const alertInputs = ref([]);
        const userEmail = ref(null);
        
        const Icons = {
            logoGoogle,
            logoFacebook,
            logoTwitter,
        };

        const oauthLogin = (platform) => {
            showLoader();
            selectedPlatform.value = platform;
            const link = `${process.env.VUE_APP_API_URL}/auth/oauth/redirect?platform=${platform}`;
            window.open(link, `oauth:${platform}`, 'location=no');

            window.addEventListener('message', function(event) {
                let requestPhone = false;
                if (event.data.match(/^oauth::/)) {
                    const data = JSON.parse(event.data.substring(7));
                    token.value = data?.token ?? null;
                    requestPhone = data?.requestPhone == 'true' ? true : false;
                    userEmail.value = data?.email ?? null;
                    showLoader();
                }
                if(requestPhone) {
                    requestPhoneNumber();
                } else {
                    handleCallback(selectedPlatform.value,token.value);  
                }
            });

        }

        const requestPhoneNumber = async () => {
            alertHeader.value = t('phone.Phone Number');
            alertButtons.value = [ {
                text: t('Cancel'),
                role: 'cancel',
                handler: () => {
                    showRequestPhoneAlert.value = false;
                    console.log('Notification alert canceled');
                },
            },
            {
                text: t('Submit'),
                role: 'confirm',
                handler: async (data) => {
                    phone.value = data.phone;
                    showRequestPhoneAlert.value = false;
                    showLoader();
                    const phoneExist = await checkPhoneExist(phone.value);
                    phoneExist ? requestPhoneNumber() : sendOtp(phone.value);
                    
                },
            }];
            alertInputs.value = [
                {
                    name: 'phone',
                    type: 'number',
                    placeholder: t('phone.Enter your phone number'),
                    value: '',
                    attributes: {
                        maxlength: 11,
                        inputmode: 'numeric',
                    },
                }
            ]
            showRequestPhoneAlert.value = true;
        };

        const sendOtp = async (phone) => {
            const url = `${process.env.VUE_APP_API_URL}/api/otp`;
            phone = phone.startsWith('0') ? phone.substring(1) : phone;
            await axios.post(url, { phone })
            .then((res) => {
                console.log(res);
                alertHeader.value = t('phone.OTP');
                // Reinit alert
                showLoader();
                setTimeout(() => showRequestPhoneAlert.value = true, 100);
                openToast(t('phone.Please enter the code that has been sent to this number'), 'warning', 'bottom');
            }).catch((err) => {
                showRequestPhoneAlert.value = false;
                openToast(t('phone.Failed to login please use another way'), 'danger', 'bottom');
            });
            alertButtons.value = [ {
                text: t('Cancel'),
                role: 'cancel',
                handler: () => { showRequestPhoneAlert.value = false; }
            }, 
            {
                text: t('Submit'),
                role: 'confirm',
                handler: (data) => {
                    otp.value = data.otp;
                    showLoader();
                    showRequestPhoneAlert.value = false;
                    updateUserData();
                }
            }
            ];

            alertInputs.value = [
                {
                    name: 'otp',
                    type: 'number',
                    placeholder: t('phone.OTP'),
                    value: '',
                }
            ]
        }
        const checkPhoneExist = async (phone) => {
            const url = `${process.env.VUE_APP_API_URL}/api/checkphone`;
            phone = phone.startsWith('0') ? phone.substring(1) : phone;
            let exists = true;
            await axios.post(url, { phone })
            .then((res) => {
                console.log(res);
                exists = res.data == 1 ? true : false;
                if (exists) {
                    openToast(t('phone.Phone number already exists'), 'danger', 'bottom');
                }
            }).catch((err) => {
                openToast(t('phone.failed to send otp please check your number and try again'), 'danger', 'bottom');
            });

            return exists;
        }

        const updateUserData = async () => {
            axios.defaults.headers.common.Authorization = `Bearer ${token.value}`;
            const url = `${process.env.VUE_APP_API_URL}/api/operations/update-phone`;
            await axios.post(url, { otp: otp.value, phone: phone.value, email: userEmail.value })
            .then((res) => {
                token.value = res.data.token;
                showLoader();
                handleCallback(selectedPlatform.value,token.value);
            }).catch((err) => console.log(err));
        }


        const handleCallback = (platform,token) => {
            switch (platform) {
                case "google":
                    if (token) {
                        // Save the user data
                        setUserData(token);
                    } else {
                        console.log("Authentication failed.");
                        openToast(t("cant login account, please try again"), 'danger', 'bottom');
                    }
                break;
                case "facebook":
                    if (token) {
                        // Save the user data
                        setUserData(token);
                    } else {
                        console.log("Authentication failed.");
                        openToast(t("cant login account, please try again"), 'danger', 'bottom');
                    }
                break;
            }
        }

        const setUserData = async (token) => {
            const url = `${process.env.VUE_APP_API_URL}/api/getuser`;
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            await axios.post(url)
            .then((res) => {
                console.log(res);
                localStorage.setItem("userData", JSON.stringify(res.data.user));
            })
            .catch((err) => {
                console.log(err);
            });
            localStorage.setItem("token", JSON.stringify({token: token,tokenType: "bearer"}));
            openToast(t("Account logged in successfully Youll be redirected to home page"), 'success', 'bottom');
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        }

        const checkPlatformActive = (platform) => {
            const activePlatforms = settings.value.oauth.platforms;
            return activePlatforms.includes(platform);
        }

        const showLoader = async () => {
            const loading = await loadingController.create({
                message: t('Loading') + ' ...',
                duration: 3000
            });

            await loading.present();
            loaderDone.value = true;
        }
        return {
            Icons,
            oauthLogin,
            checkPlatformActive,
            t,
            phone,
            showRequestPhoneAlert,
            alertButtons,
            alertInputs
        };
    }
}
</script>

<style scoped>
div.or {
    display: flex;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;
    color: #b3b3b3;
    font-weight: 600;
    font-size: 14px;
    text-align: center;
    width: 100%;
}

div.or span.line {
    flex: 1;
    height: 1px;
    background-color: #b3b3b3;
    margin: 0 10px;
}

div.social-icons {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 20px;
    font-weight: 600;
    font-size: 2rem;
    text-align: center;
    width: 100%;
}
</style>