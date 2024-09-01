<template>
<template>
<base-layout :pageTitle="t('Saved Shops')" :show-menu-button="false">
    <div v-if="shops.length > 0" class="d-flex flex-column mt-5">
        <div class="location row" v-for="shop in shops" :key="shop.id">
            <div class="shop-data d-flex">
                <div class="shop-image me-2"><img src="assets/images/logo.png" style="max-width: 100px;margin: 10px auto;" :alt=shop.shopName></div>
                <div class="shop-address my-3 mx-1">
                    <div class="fw-bolder fs-6">{{ shop.shopName }}</div>
                    <div style="color: var(--background); font-size: 12px;">{{ shop.shopAddress }}</div>
                </div>
            </div>
            <div> <a target="_blank" :href="'https://www.google.com/maps/search/?api=1&query=' + parseFloat(shop.latitude) + ',' + parseFloat(shop.longitude)" class="mapsBtn">Google Maps</a></div>
        </div>
    </div>
    <div v-else class="mt-5 mx-auto">
      <img width="50" src="/assets/icons/no-content.png" alt="No Content">
      <h4 style="font-weight: 600; margin: 20px;"> No Shops Available</h4>
    </div>
</base-layout>
</template>
</template>

<script>
import { onMounted, ref } from 'vue';
import axios from 'axios';
export default {
    name: 'Saved',
    setup() {
        const shops = ref([]);

        const getShops = async () => {
            const url = `${process.env.VUE_APP_API_URL}/api/operations/shops/get-save`;
            axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
            await axios.get(url)
                .then((res) => {
                    shops.value = res?.data?.length > 0 ? res.data : [];
                })
                .catch((err) => console.log(err));
        }
        getShops();
        return {
            shops
        }
    }
};
</script>

<style scoped> 

</style>