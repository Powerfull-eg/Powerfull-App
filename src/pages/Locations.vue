<template>
<base-layout :pageTitle="t('Locations')" :show-menu-button="false">
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
      <h4 style="font-weight: 600; margin: 20px;"> No Locations Available</h4>
    </div>
</base-layout>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
export default {
  name: 'Locations',
  setup() {
    const { t } = useI18n();
    const online = localStorage.connection == true;
    const cabinetlocations = ref([]);
    const shops = JSON.parse(localStorage.shops);

    onMounted(() => {
      cabinetlocations.value = [
        {
          name: 'Location 1', lat: 29.890542, lng: 31.190542, id: 4,
        },
        {
          name: 'Location 2', lat: 30.223036, lng: 31.390542, id: 5,
        },
        {
          name: 'Location 3', lat: 29.928249, lng: 31.490542, id: 3,
        },
        {
          name: 'Location 4', lat: 30.50010128657071, lng: 31.440542, id: 2,
        },
        {
          name: 'Location 5', lat: 30.350198, lng: 31.460542, id: 1,
        },
      ];

      // let content = document.querySelector("#main-content > div > ion-content");
      // content.classList.add("hide-scrollbar");
    });
    return { shops, online, t };
  },
};
</script>

<style scoped>
.location{
    width: 80vw;
    background: var(--color);
    border-radius: 41px;
    color: #000;
    padding: 10px;
    box-shadow: #0000005c 0px 7px 12px 8px;
    margin: 3rem auto;
}
.shop-image {
    align-items: center;
    display: flex;
}
.mapsBtn{
    text-decoration: unset;
    background: var(--background);
    color: var(--color);
    padding: 1rem 3rem;
    border-radius: 30px;
    display: block;
    margin: 10px auto;
    text-align: center;
    width: 40vw;
}
    p.card-text {
        width: 97%
    }
    .qrBtn {
        text-decoration: unset;
        background: #f68d41;
        color: #fff;
        border: 1px solid;
        padding: 1rem;
        border-radius: 30px;
        margin: 10px 0;
    }
    .card-body {
        padding : 0 7px;
    }
</style>
