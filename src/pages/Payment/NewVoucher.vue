<template>
    <base-layout page-default-back-link="/" :pageTitle="'New Coupon'" :show-menu-button="false" loading="lazy">
      <div class="page-container">
        <form id="voucher" @click.prevent="submitVoucher">
            <div class="form-inputs d-flex flex-column" style="margin-top: 30%;">
                <span class="fs-5 my-2" style="font-weight: 600;">Welcome {{ userData.first_name }}</span>
                <span class="fs-6 my-2">Enter Your Coupon Code</span>
                <ion-input name="voucher" required v-model="voucher" autocomplete label-placement="floating" type="text" placeholder="Coupon Code"></ion-input>
            
                <div class="form-submit">
                    <button type="submit">Confirm</button>
                </div>
            </div>
        </form>
    </div>
</base-layout>
</template>

<script>

export default {
  name: 'New Voucher',
  setup() {
    const userData = JSON.parse(localStorage.userData);
    const submitVoucher = () => {
        return;
    };

    return { submitVoucher,userData };
  },
};
</script>

<style scoped>
.page-container {
    width: 75%;
    margin: 0 auto;
    text-align: center;
}

div.form-inputs > ion-input{
    border: 2px solid;
    border-radius: 30px;
    width: 90%;
    margin: 10px auto;
    text-align: start;
    font-size: 16px;
    }

    div.form-submit > button{
        background-color: var(--background);
        color: var(--color);
        border: 1px solid var(--color);
        padding: 10px 50px;
        border-radius: 30px;
        box-shadow: var(--color) 1px 0px 5px;
        margin: 10px;
    }
</style>