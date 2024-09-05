<template>
    <base-layout :pageTitle="t('Saved Shops')" :show-menu-button="false">
        <div class="container w-100" v-if="!loading">
            <div v-if="shops.length > 0" class="d-flex flex-column mt-5">
                <div class="location row" v-for="shop in shops" :key="shop.shop_id">
                    <div class="shop-data d-flex">
                        <div class="shop-image me-2"><img :src="shop?.shop?.logo ?? 'assets/images/logo.png'" style="max-width: 100px;margin: 10px auto;" :alt=shop.shopName></div>
                        <div class="shop-address my-3 mx-1">
                            <div class="fw-bolder fs-6">{{ shop?.shop?.name ?? '' }}</div>
                            <div style="color: var(--background); font-size: 12px;">{{ shop?.shop?.address ?? '' }}</div>
                        </div>
                    </div>
                    <div> <a target="_blank" :href="'https://www.google.com/maps/search/?api=1&query=' + shop?.shop?.location" class="mapsBtn">Google Maps</a></div>
                </div>
            </div>
            <div v-else class="mt-5 mx-auto text-center">
            <img width="50" src="assets/icons/no-plcae.png" alt="No Content">
            <h4 style="font-weight: 600; margin: 20px;"> {{ t('No Saved Shops') }}</h4>
            </div>
            <!-- Loader -->
        </div>
        <div v-else class="d-flex justify-content-center mt-5">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </base-layout>
    </template>
    
    <script>
    import { onMounted, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { onUpdated } from 'vue';
    import axios from 'axios';
    import useToast from './../composition/useToast';
    export default {
      name: 'Saved',
      setup() {
        const shops = ref([]);
        const { openToast } = useToast();
        const { t } = useI18n();
        const online = localStorage.connection == true;
        const cabinetlocations = ref([]);
        const loading = ref(true);
        const getSavedShops = async () => {
            loading.value = true;
            try {
                axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
                const url = `${process.env.VUE_APP_API_URL}/api/operations/shops/get-save`;

                const res = await axios.get(url);
                console.log(res.data);
                shops.value = res.data;
                loading.value = false;
            } catch (err) {
                console.log(err);
                openToast(t('something_went_wrong'), 'danger', 'bottom');
                loading.value = false;
            }
        }
        
        onUpdated(() => {
            getSavedShops();
        });
        onMounted(() => {
            getSavedShops();
        }) 

        
        return { shops, online, t, loading };
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