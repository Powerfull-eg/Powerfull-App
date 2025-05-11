<template>
  <div class="offcanvas offcanvas-bottom" tabindex="-1" id="offcanvasCard" aria-labelledby="offcanvasBottomLabel">
    <div class="offcanvas-header fs-3">
      <h5 class="offcanvas-title" id="offcanvasBottomLabel">{{t("Payment")}}</h5>
      <button type="button" class="btn-close" @click.prevent="offcanvasCard.hide()" data-bs-dismiss="offcanvas"
        aria-label="Close"></button>
    </div>
    <div class="offcanvas-body small">
      <div style="width: 100%; display: flex; justify-content: flex-end;">
        <button type="button" class="fs-4" style="background: none; color: #000;" @click.prevent="getCards()"><ion-icon :icon="icons.refreshOutline"></ion-icon></button>
      </div>
      <div v-if="cards.length > 0">
        <div v-for="card in cards" :key="card.id" @click="selectCard(card)" class="card-container row my-2">
          <img src="/assets/icons/credit-card.png" width="15" class="img-fluid col-4" alt="">
          <div class="info col-8 d-flex flex-column">
            <span>{{ card.card_type }}</span>
            <span>{{ card.card_number }}</span>
          </div>
        </div>
      </div>
      <div v-else class="alert alert-danger text-center fs-5">{{t("There arent any added cards")}}</div>
        <div class="d-flex justify-content-between">
          <router-link style="font-size: 1rem; display:flex; align-items: center; gap: 3px;" :to="{ name: 'Wallet' }"> {{t("Add another payment")}} <ion-icon :icon="icons.addCircleOutline"></ion-icon></router-link>
          <router-link style="font-size: 1rem; display:flex; align-items: center; gap: 3px;"  :to="{ name: 'Vouchers' }"> {{t("vouchers.Add Voucher")}} <img width="20" src="/assets/icons/add-voucher.png" alt=""></router-link>
        </div>
    </div>
  </div>
    <!-- Request CVV Alert -->
    <!-- <ion-alert :is-open="cvvAlert.show"
    trigger="present-alert"
    :header="cvvAlert.header"
    :buttons="cvvAlert.buttons"
    :inputs="cvvAlert.inputs"
    @didDismiss="setAlertOpen(false)"
    animated="true"
    >
  </ion-alert> -->
  <div class="modal fade" id="cvv" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <div class="d-flex justify-content-between">
            <span style="color: #000;">{{ t('CVV') }}</span>
            <button type="button" class="btn-close" data-bs-dismiss="modal" @click="setAlertOpen(false)" aria-label="Close"></button>
          </div>
          <div class="w-100 text-center my-3">
            <input type="number" maxlength="3" onbeforeinput="this.value = this.value.slice(0, 2)" :placeholder="t('Enter CVV Number')" name="cvv" v-model="cvv">
          </div>
          <div class="text-center">
            <button type="button" @click="cvvSubmitHandler" style="background-color: var(--background); color: #fff; padding: 10px 40px;" class="btn">{{t('Submit')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { useI18n } from 'vue-i18n';
import * as bootstrap from 'bootstrap';
import { ref,onMounted } from 'vue';
import axios from 'axios';
import { refreshOutline } from 'ionicons/icons';
import { IonIcon, IonSpinner, IonAlert, loadingController, IonModal, IonInput, IonButton, IonItem, IonContent, IonHeader, IonToolbar, IonButtons, IonTitle } from '@ionic/vue';
import useToast from '../../composition/useToast';

export default {
    name: "CardsComponent",
    components: {
      IonIcon, IonSpinner, IonAlert, IonModal, IonInput, IonButton, IonItem, IonContent, IonHeader, IonToolbar, IonButtons, IonTitle
    },
    props: {
        action: Function
    },
    setup(props) {
        const { t } = useI18n();
        const cards = ref([]);
        const offcanvasCard = ref(null);
        const selectedCard = ref(null);
        const icons = { refreshOutline };
        const { openToast } = useToast();
        const cvv = ref(null);
        let cvvModal;
        const cvvAlert = ref({
            show: false,
            header:t('cvv'),
            buttons: [
                {
                    text: t('Cancel'),
                    role: 'cancel',
                    handler: () => setAlertOpen(false),
                },
                {
                    text: t('Submit'),
                    role: 'confirm',
                    handler: (data) => {
                        cvv.value = data.cvv;
                        props.action(selectedCard.value, cvv.value);
                        setAlertOpen(false);
                    }
                }
            ],
            inputs: [
            {
                    name: 'cvv',
                    type: 'text',
                    placeholder: t('Enter CVV Number'),
                    value: '',
                    attributes: {
                        maxlength: 3,
                        id: 'cvv',
                        inputmode: 'numeric',
                    },
                }
            ]
        });
        
        onMounted(() => {
            offcanvasCard.value = new bootstrap.Offcanvas(document.querySelector('#offcanvasCard'));
            cvvModal = new bootstrap.Modal(document.getElementById('cvv'),{ backdrop: false });
            document.getElementById('cvv').addEventListener('hide.bs.modal', () => cvv.value = '');
            getCards();
        });

        // get user current cards
        const getCards = async () => {
        showLoader();
        axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
        const url = `${process.env.VUE_APP_API_URL}/api/operations/get-cards`;
        await axios.get(url)
            .then((res) => {
            cards.value = res.data.cards;
            // Update user cards
            const data = JSON.parse(localStorage.userData);
            data.cards = cards.value;
            localStorage.userData = JSON.stringify(data);
            })
            .catch((err) => console.log(err));

        return cards;
        };

        const showLoader = async () => {
            const loading = await loadingController.create({
                message: t('Loading') + ' ...',
                duration: 3000
            });

            await loading.present();
        }

        
        const selectCard = async (card) => {
        const orders = await getOrders();
        // Check if there are cards exist

        if (cards.value.length <= 0) {
            setTimeout(() => {
            openToast("You doesn't have any added card", 'danger', 'bottom');
            }, 500);
        } else if (orders != null) {
            // check in completed orders
            if (orders.length > 0) {
            let inCompletedOrders = 0;
            orders.map((order) => { order.status != 3 ? inCompletedOrders++ : ''; });
                if (inCompletedOrders > 0) {
                    openToast("You Can't place new order unless complete the previous one", 'danger', 'bottom');
                    return;
                }
            }
            selectedCard.value = card;
            setAlertOpen(true);
        } else if (orders == null) { openToast('Please Check your internet connection and try again', 'danger', 'bottom'); }
        };

            // get user previous orders
        const getOrders = async () => {
            let orders = null;
            axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
            const url = `${process.env.VUE_APP_API_URL}/api/operations/orders`;
            await axios.post(url)
                .then((res) => {
                console.log(res);
                orders = res.data.orders;
                })
                .catch((err) => {
                console.log(err);
                orders = null;
                });
            return orders;
        };

        const setAlertOpen = (status) => {
            cvvAlert.value.show = status;
            offcanvasCard.value.hide();
            status == true ? cvvModal.show() : cvvModal.hide();
        }

        const cvvSubmitHandler =  () => {
                        props.action(selectedCard.value, cvv.value);
                        setAlertOpen(false);
                    }

      return {
          t,
          cards,
          getCards,
          offcanvasCard,
          icons,
          selectedCard,
          selectCard,
          openToast,
          cvvAlert,
          setAlertOpen,
          cvv,
          cvvSubmitHandler
      }
    }
}
</script>

<style scoped>
    #offcanvasCard {
  --bs-offcanvas-height: 55%;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  border-top: 5px solid #f68d41;
  padding: 0 10px;
}

.spinner-border {
  color: var(--background);
  margin: 0 auto;
  display: block;
}

.offcanvas-header {
  padding: 20px 20px 0 0;
}

.offcanvas-body {
  padding: 0;
  padding-top: 30px;
}

#offcanvasCard div.info {
  margin-top: 10px;
}

#offcanvasCard div.info>span {
  font-size: 16px;
  font-weight: 300;
}

#offcanvasCard div.info>span:first-of-type {
  font-weight: 600;
}

#offcanvasCard .card-container {
  border: 0.5px solid #a19090;
  margin: 10px;
  border-radius: 12px;
}

#offcanvasCard a {
  text-decoration: unset;
  text-align: center;
  display: block;
  margin: 5px;
  font-size: 20px;
}

#cvv .modal-content {
  top: 100px !important;
  border-radius: 20px;
  border: 1px solid #f68d41;
}

#cvv input[name="cvv"] {
  background-color: rgb(255, 255, 255);
    color: #848484;
    border: 0;
    width: 120px;
    border-bottom: 1px solid #ddd;
    margin: 10px auto;
    text-align: center;
    direction: rtl;
}

#cvv input[name="cvv"]:focus {
    border: 0;
    border-bottom: 1px solid #ddd;
    outline: 0;
}
</style>