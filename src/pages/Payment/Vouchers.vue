<template>
<base-layout page-default-back-link="/" :pageTitle="t('Coupons')" :show-menu-button="false" loading="lazy">
  <div class="page-container d-flex flex-column w-100">
    <div class="sections d-flex flex-row justify-content-around w-100">
        <h3 target="new" @click="selectType" style="font-size: 1.2rem;" class="selected">{{t('New')}}</h3>
        <h3 target="used" @click="selectType" style="font-size: 1.2rem;">{{t('Used')}}</h3>
        <h3 target="expired" @click="selectType" style="font-size: 1.2rem;">{{t('Expired')}}</h3>
    </div>
    <div class="coupons" data-type="new" style=" display: block;">
        <div v-if="allVouchers?.new.length > 0"  v-for="newVoucher in allVouchers.new" :key="newVoucher.id" class="coupon my-2 py-2 d-flex flex-column align-items-center justify-content-center">
            <div :data-id="newVoucher.id" style="overflow: hidden;box-shadow: rgb(0, 0, 0) 6px 5px 20px;background: linear-gradient(90deg, rgba(242,121,32,1) 57%, rgba(251,180,108,1) 84%);" class="couponCon w-75 d-flex flex-row justify-content-center text-white bg-transparent rounded-4 p-2">
                <ion-icon style="font-size: 3rem; flex-grow: 0.5; padding: 5px;" src="assets/icons/ticket-outline.svg"></ion-icon>
                <div  class="couponContent flex-grow-1 d-flex flex-column">
                    <h3>{{ newVoucher.value + (newVoucher.type === 1 ? " "+t("LE") : "%") }} {{t('Discount')}}</h3>
                    <p style="margin: 0;">{{t('Minimum Amount')}}: <span class="fw-bold">{{newVoucher.min_amount}}</span></p>
                    <p>{{t('Expires at')}} <span class="fw-bold">{{(new Date(newVoucher.to).toLocaleDateString())}}</span></p>
                </div>
                <img @click="selectVoucher($event)" src="assets/icons/circleEmpty.png" style="align-self: center;" width="50" height="50" alt="">
            </div>
        </div>
        <div v-else><img src="/assets/icons/no-voucher.png" width="200" class="d-block mx-auto my-5" alt=""></div>
    </div>
    <div class="coupons" data-type="used" style="display: none;">
        <div v-if="allVouchers?.used.length > 0" v-for="usedVoucher in allVouchers.used" :key="usedVoucher.id" class="coupon my-2 py-2 d-flex flex-column align-items-center justify-content-center">
            <div :data-id="usedVoucher.id" style="overflow: hidden;box-shadow: rgb(0, 0, 0) 6px 5px 20px;background: linear-gradient(90deg, rgba(242,121,32,1) 57%, rgba(251,180,108,1) 84%);" class="couponCon w-75 d-flex flex-row justify-content-center text-white bg-transparent rounded-4 p-2">
                <ion-icon style="font-size: 3rem; flex-grow: 0.5; padding: 5px;" src="assets/icons/ticket-outline.svg"></ion-icon>
                <div  class="couponContent flex-grow-1 d-flex flex-column">
                    <h3>{{ usedVoucher.value + (usedVoucher.type === 1 ? " "+t("LE") : "%") }} {{t('Discount')}}</h3>
                    <p style="margin: 0;">{{t('Minimum Amount')}}: <span class="fw-bold">{{usedVoucher.min_amount}}</span></p>
                    <p>{{t('Used at')}}: <span class="fw-bold">{{(new Date(usedVoucher.used_at).toLocaleDateString())}}</span></p>
                </div>
            </div>
        </div>
        <div v-else><img src="/assets/icons/no-voucher.png" width="200" class="d-block mx-auto my-5" alt=""></div>
    </div>
    <div class="coupons" data-type="expired" style=" display: none;">
        <div v-if="allVouchers?.expired.length > 0" v-for="expiredVoucher in allVouchers.expired" :key="expiredVoucher.id" class="coupon my-2 py-2 d-flex flex-column align-items-center justify-content-center">
            <div :data-id="expiredVoucher.id" style="overflow: hidden;box-shadow: rgb(0, 0, 0) 6px 5px 20px;background: linear-gradient(90deg, rgba(242,121,32,1) 57%, rgba(251,180,108,1) 84%);" class="couponCon w-75 d-flex flex-row justify-content-center text-white bg-transparent rounded-4 p-2">
                <ion-icon style="font-size: 3rem; flex-grow: 0.5; padding: 5px;" src="assets/icons/ticket-outline.svg"></ion-icon>
                <div  class="couponContent flex-grow-1 d-flex flex-column">
                    <h3>{{ expiredVoucher.value + (expiredVoucher.type === 1 ? " LE" : "%") }} {{t('Discount')}}</h3>
                    <p style="margin: 0;">{{t('Minimum Amount')}}: <span class="fw-bold">{{expiredVoucher.min_amount}}</span></p>
                    <p>{{t('Expired at')}}: <span class="fw-bold">{{(new Date(expiredVoucher.to).toLocaleDateString())}}</span></p>
                </div>
            </div>
        </div>
        <div v-else><img src="/assets/icons/no-voucher.png" width="200" class="d-block mx-auto my-5" alt=""></div>
    </div>
  </div>
</base-layout>
</template>

<script>
import axios from 'axios';
import { ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
export default {
    name: "Vouchers",
    setup(){
        const { t } = useI18n();
        const allVouchers = ref(null);
        const selectedVocuher = ref(null);
        localStorage.selectedVoucher = JSON.stringify(selectedVocuher.value);
        
        // Get All vouchers
        const getVocuher = async () => {
                    axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
                    const url = `${process.env.VUE_APP_API_URL}/api/operations/vouchers`;
                    await axios.get(url)
                    .then(res => {
                        allVouchers.value = res.data.vouchers;
                    })
                    .catch(err => console.log(err))
                    
                }
        watchEffect(getVocuher(),{deep:true});

        // Select specific voucher
        const selectVoucher = (e) => {
            const icon = e.target;
            // clear all filled
            document.querySelectorAll("[src='assets/icons/checkedCircle.png']").forEach(ele => {
                ele.setAttribute("src",`assets/icons/${ele === icon ? "checkedCircle" : "circleEmpty"}.png`);
            });

            if(icon.getAttribute("src") === "assets/icons/circleEmpty.png"){
                icon.setAttribute("src","assets/icons/checkedCircle.png");
                selectedVocuher.value = parseInt(e.target.parentElement.getAttribute("data-id"));
            }else{
                icon.setAttribute("src","assets/icons/circleEmpty.png");
                selectedVocuher.value = null;
            }
            return localStorage.selectedVoucher = JSON.stringify(selectedVocuher.value);
        };

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


        return { allVouchers, selectVoucher, selectType, t }
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
</style>