<template>
<base-layout :pageTitle="t('Gifts')" :show-menu-button="false" loading="lazy">
  <div class="page-container d-flex flex-column w-100">
    <div class="sections d-flex flex-row justify-content-around w-100">
        <h3 target="new" @click="selectType" style="font-size: 1.2rem;" class="selected">{{t('New')}}</h3>
        <h3 target="used" @click="selectType" style="font-size: 1.2rem;">{{t('Used')}}</h3>
        <h3 target="expired" @click="selectType" style="font-size: 1.2rem;">{{t('Expired')}}</h3>
    </div>
    <div class="gifts" data-type="new" style=" display: block;">
        <div v-if="gifts?.new?.length > 0"  v-for="gift in gifts.new" :key="gift.gift_id" class="coupon my-2 py-2 d-flex flex-column align-items-center justify-content-center">
            <div :data-id="gift.gift_id" style="overflow: hidden;box-shadow: rgb(0, 0, 0) 6px 5px 20px;background: linear-gradient(90deg, rgba(242,121,32,1) 57%, rgba(251,180,108,1) 84%);" class="couponCon w-75 d-flex flex-row justify-content-center text-white bg-transparent rounded-4 p-2">
                <img style="font-size: 3rem; flex-grow: 0.5; padding: 5px; width:50px; height: 50px;" src="assets/icons/gift-white.png">
                <div  class="couponContent flex-grow-1 d-flex flex-column">
                    <h3 class="fw-bold fs-2">{{ lang == 'en' ? gift.gift.title_en : gift.gift.title_ar}}</h3>
                    <h5 :style="lang == 'en' ? 'direction:ltr': 'direction:rtl'">{{ (lang == 'en' ? gift.gift.message_en : gift.gift.message_ar) +" " +  gift.shop_name}}</h5>
                    <p>{{t('Expires at')}} <span class="fw-bold">{{(new Date(gift.expire).toLocaleDateString())}}</span></p>
                    <button class="btn b-1 show-code" @click="showCode(gift)">{{t('Show Code')}}</button>
                </div>
            </div>
        </div>
        <div v-else><img src="/assets/icons/no-gift.png" width="200" class="d-block mx-auto my-5" alt=""></div>
    </div>
    <div class="gifts" data-type="used" style=" display: none;">
        <div v-if="gifts?.used?.length > 0"  v-for="gift in gifts.used" :key="gift.gift_id" class="coupon my-2 py-2 d-flex flex-column align-items-center justify-content-center">
            <div :data-id="gift.gift_id" style="overflow: hidden;box-shadow: rgb(0, 0, 0) 6px 5px 20px;background: linear-gradient(90deg, rgba(242,121,32,1) 57%, rgba(251,180,108,1) 84%);" class="couponCon w-75 d-flex flex-row justify-content-center text-white bg-transparent rounded-4 p-2">
                <img style="font-size: 3rem; flex-grow: 0.5; padding: 5px; width:50px; height: 50px;" src="assets/icons/gift-white.png">
                <div  class="couponContent flex-grow-1 d-flex flex-column" :style="lang == 'ar' ? 'direction:rtl': 'direction:ltr'">
                    <h3 class="fw-bold fs-2">{{ lang == 'en' ? gift.gift.title_en : gift.gift.title_ar}}</h3>
                    <h5 :style="lang == 'en' ? 'direction:ltr': 'direction:rtl'">{{ (lang == 'en' ? gift.gift.message_en : gift.gift.message_ar) +" " +  gift.shop_name}}</h5>
                    <p>{{t('Used at')}}: <span class="fw-bold">{{(new Date(gift.used_at).toLocaleDateString())}}</span></p>
                </div>
            </div>
        </div>
        <div v-else><img src="/assets/icons/no-gift.png" width="200" class="d-block mx-auto my-5" alt=""></div>
    </div>
    <div class="gifts" data-type="expired" style=" display: none;">
        <div v-if="gifts?.expired?.length > 0"  v-for="gift in gifts.expired" :key="gift.gift_id" class="coupon my-2 py-2 d-flex flex-column align-items-center justify-content-center">
            <div :data-id="gift.gift_id" style="overflow: hidden;box-shadow: rgb(0, 0, 0) 6px 5px 20px;background: linear-gradient(90deg, rgba(242,121,32,1) 57%, rgba(251,180,108,1) 84%);" class="couponCon w-75 d-flex flex-row justify-content-center text-white bg-transparent rounded-4 p-2">
                <img style="font-size: 3rem; flex-grow: 0.5; padding: 5px; width:50px; height: 50px;" src="assets/icons/gift-white.png">
                <div  class="couponContent flex-grow-1 d-flex flex-column">
                    <h3 class="fw-bold fs-2">{{ lang == 'en' ? gift.gift.title_en : gift.gift.title_ar}}</h3>
                    <h5 :style="lang == 'en' ? 'direction:ltr': 'direction:rtl'">{{ (lang == 'en' ? gift.gift.message_en : gift.gift.message_ar) +" " + gift.shop_name}}</h5>
                    <p>{{t('Expired at')}}: <span class="fw-bold">{{(new Date(gift.expire).toLocaleDateString())}}</span></p>
                </div>
            </div>
        </div>
        <div v-else><img src="/assets/icons/no-gift.png" width="200" class="d-block mx-auto my-5" alt=""></div>
    </div>
  </div>


<!-- Modal -->
<div class="modal fade text-dark" id="giftModall" tabindex="-1" aria-labelledby="giftModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header mx-auto">
        <h1 class="modal-title text-center fs-5 fw-bold" style="color: var(--background)" id="giftModalLabel">{{ modal.title_ar }}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <img class="shake-top" style="width: 100px;display:block;margin: 0 auto;" :src="modal.img ?? '/assets/icons/gift.png'" :alt="modal.title">
        <h1 class="text-center fs-4 mt-3" style="line-height: 2;">{{t('Your Code is:')}} <br> <span class="fw-bold">{{ modal.code }}</span> </h1>
      </div>
    </div>
  </div>
</div>
</base-layout>
</template>

<script>
import axios from 'axios';
import { gift } from 'ionicons/icons';
import { onMounted, onUpdated, ref, watchEffect } from 'vue';
import * as bootstrap from 'bootstrap';
import {tsParticles} from './../../assets/tsParticles-confetti';
import particlesOptions from "./../../assets/particlesOptions";
import { useI18n } from 'vue-i18n';
export default {
    name: "Vouchers",
    setup(){
        const {t} = useI18n();
        const lang = localStorage?.locale
        const allGifts = ref([]);
        const gifts = ref({});
        const modal = ref({title:'',img:'',code:''});
        let bsModal;
        onMounted(() => {
            bsModal = new bootstrap.Modal(document.querySelector("#giftModall"),{backdrop: false, keyboard: false});
        });
        // Get All vouchers
        const getGifts = async () => {
            axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
            const url = `${process.env.VUE_APP_API_URL}/api/operations/gifts`;
            await axios.post(url)
            .then(res => {
                allGifts.value = res.data;
                splitGiftTypes();
            })
            .catch(err => console.log(err))
            
        }
        onUpdated(() => { getGifts() });
        watchEffect(getGifts());

        // Select specific gift
        const selectType = (e) => {
            const allTypes = document.querySelectorAll("[data-type]");
            const allTargets = document.querySelectorAll("[target]");
            const selectedType = e.target.getAttribute("target");
            // add class to selected type's target
            allTargets.forEach(target => {
                if(target.getAttribute("target") === selectedType){ return target.classList.add("selected"); }
                return target.classList.remove("selected")
            });

            // remove unselected types
            allTypes.forEach(type => {
                if(type.getAttribute("data-type") === selectedType){ return type.style.display = "block"; }
                return type.style.display = "none";
            });
        };

        // detect gift type
            const splitGiftTypes = () => {
                const newGifts = [],used =[],expired = [];
                allGifts.value.forEach(gift => {
                    if(new Date(gift.expire) < new Date && gift.used_at === null){ expired.push(gift); }
                    else if(gift.used_at !== null){ used.push(gift); }
                    else if(new Date(gift.expire) > new Date && gift.used_at === null){newGifts.push(gift)};
                });
                gifts.value = {new:newGifts,used,expired};
            }           

        // Open modal to show code
        const showCode = (gift) => {
            modal.value = gift;
            bsModal.toggle();
            const particles = tsParticles.load(particlesOptions);
            setTimeout(() => { particles.then(data => data.destroy()) },3000);
        };
        return { gifts, selectType, modal, showCode, t, lang }
    }
}
</script>

<style scoped>
h3
{
    padding: 10px;
}
.page-container {
    margin-top: 4rem;
}

.new_coupon {
    text-align: center;
    border: 2px solid var(--color);
    padding: 1rem;
    margin: 2rem auto;
    border-radius: 20px;
    width: 75%;
    display: block;
    color: unset;
    text-decoration: unset;
    font-size: 1.2rem;
    font-weight: 500;
}
.newPayment{
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
.new-coupon-container {
    bottom: 0;
  position: fixed;
  width: 100%;
  padding: 2.5rem 0;
  background-color: var(--background);
  border-top-left-radius: 2rem;
  border-top-right-radius: 2rem;
  border-top: 5px solid var(--color);
}

div.vouchers {
    margin-bottom: 100%;
}
div.voucher {
    min-height: 150px;
    display: flex;
    margin: 15px 0;
}

div.voucher div.left {
    width: 25%;
    display: flex;
    background: #f27920;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    border: 3px solid var(--color);
}

div.voucher div.left span.empty {
    display: inline-block;
    width: 50%;
    clip-path: circle(20% at 5%);
    background: #fff;
}
div.voucher div.left span.price{   
    transform: rotate(-90deg);
    align-self: center;
    color: #fff;
    font-weight: 500;
    width: 100%;
    font-size: 1.1rem;
}
div.voucher div.right{ 
    display: flex;
    background: #eeeeee;
    width: 91%;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    border: 3px solid var(--color);
}
div.voucher div.right div.content{
    width: 91%;
    display: flex;
    justify-content: space-between;
}
div.voucher div.right div.content div.left-content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: start;
    padding: 0 10px;
}
div.voucher div.right div.content .right-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
div.voucher div.right div.content div.left-content span.name {
    font-size: 20px;
    font-weight: 600;
    color: #000;
}
div.voucher div.right span.empty {
    display: inline-block;
    width: 12%;
    clip-path: circle(20% at 95%);
    background: #fff;
}
div[data-type] {
    transition: .4s .4s ease-in;
}
.sections h3.selected {
    border: 1px solid #fff;
    border-radius: 10%;
    background: var(--color);
    color: var(--background);
    transition: .2s .2s ease-in;
}

button.show-code {
    color: var(--background);
    border: 1px solid;
    width: fit-content;
    margin: 5px auto;
    background: var(--color);
}
</style>