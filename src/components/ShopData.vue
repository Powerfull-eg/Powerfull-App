<template>
    <!-- Modal -->
    <div class="offcanvas-header">
        <div class="top d-flex justify-content-between w-100 pb-3">
            <!-- shop image -->
            <div class="shop-logo" style="flex-basis: 20%; width: 100%; position: relative">
                <img :src="modalData?.data?.logo ?? ( modalData?.logo ?? 'assets/images/powericon.png')" style="position: absolute; object-fit: contain; top: 10%; width: 75%; height: 75%;">
            </div>
            <!-- name and summary data -->
            <div class="shop-info" style="flex-basis: 100%;">
            <!-- name -->
            <div class="shop-name" style="flex-basis: 70%;display: grid;">
                <div class="d-flex elipsis">
                <h2 class="offcanvas-title" >{{ modalData?.name }}</h2>
                </div>
            </div>
            <!-- summary data -->
            <div class="summary d-flex flex-row justify-content-start">
                <!-- distance -->
                <div class="distance" style="padding-right: 5px;">
                    <img src="assets/icons/telegram.svg" style=" width: 1rem" alt="distance">
                    <span>{{ getUserDistance(modalData?.data?.location?.length > 0 ? modalData?.data?.location?.split(",") : modalData?.location?.split(",")) }}</span>
                    <span>{{ userDistance }}</span>
                </div>
                <!-- time -->
                <div class="timing d-flex flex-row" v-if="isShopOpen() !== null" style="padding: 0 5px 0 0;">
                    <img src="assets/icons/time.svg" style=" width: 1rem;" alt="distance">
                    <span class="font-weight-bold" v-if="isShopOpen() === true" style="color: #00ff00; padding: 0 5px 0 0;"> {{ t('shop.Open') }}</span>
                    <span class="font-weight-bold" v-else style="color: #ff0000; padding: 0 5px 0 0;"> {{ t('shop.Closed') }}</span>
                    <span v-if="modalData?.data?.closes_at">{{convertTo12Hour(modalData?.data?.closes_at)}} {{ t("shop.Closes") }}</span>
                </div>
                <!-- device status -->
                <div class="device-status" v-if="isDeviceOnline() !== null">
                    <div v-if="isDeviceOnline()" class="font-weight-bold" style="padding:3px; background-color: #8ac78a; display: flex; width: 100%;"> 
                        <span style="border-radius:50%;width: 15px;display: block;margin-right: 3px; background-color: #004324;"></span>
                        <span style="font-size: 8px;">{{ t('shop.Ready') }}</span>
                    </div>
                    <div v-else class="font-weight-bold" style="padding:3px; background-color: #fff; border: 1px solid; display: flex;"> 
                        <span style="border-radius:50%; width: 15px;height: 15px; display: block;margin-right: 3px; background-color: #ff0000;"></span>
                        <span>{{ t('shop.Not-Ready') }}</span>
                    </div>
                </div>
            </div>
            </div>
            <!-- close -->
            <button type="button" style="position: absolute; top: 20px; right: 10px;" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
    </div>
    <div class="offcanvas-body small middle" style="overflow-x: hidden;">
        <!-- Body Top Part -->
        <div class="body-top d-flex justify-content-between w-100 px-3" style="height: 50px;">
            <!-- Access -->
            <div class="access d-flex">

            <img style="width: 30px; height: 30px;" :src="modalData?.data?.type && modalData?.data?.type?.access_icon ? modalData?.data?.type?.access_icon : 'assets/icons/group.png'" alt="distance">
            <div class="d-flex flex-column">
                <span>{{t('shop.access')}}</span>
                <span>{{ modalData?.data?.type ? (lang == 'ar' ? modalData?.data?.type?.access_ar_name : modalData?.data?.type?.access_en_name) : t('Not Defined') }}</span>
            </div>
            </div>
            <!-- Type -->
            <div class="type d-flex">
            <img style="width: 30px; height: 30px;" :src="modalData?.data?.type && modalData?.data?.type?.type_icon ? modalData?.data?.type?.type_icon : 'assets/icons/cart.png'" alt="distance">
            <div class="d-flex flex-column">
                <span>{{t('shop.type')}}</span>
                <span>{{ modalData?.data?.type ? (lang == 'ar' ? modalData?.data?.type?.type_ar_name : modalData?.data?.type?.type_en_name) : t('Not Defined') }}</span>
            </div>
            </div>
            <!-- Price -->
            <div class="price d-flex">
            <img src="assets/icons/dollar.png" alt="distance">
                <div class="d-flex flex-column">
                    <span>{{t('shop.price')}}</span>
                    <span>{{ price() }}</span>
                </div>
            </div>
        </div>
        <!-- Body middle Part -->
        <div class="body-middle d-flex justify-content-between w-100 p-3" style="height: 50px;">
            <!-- qr scan button -->
            <div @click="openScanner" class="qr-scan d-flex">
            <img src="assets/icons/qr-code.png" alt="distance">
            <span>{{ t('Scan') }}</span>
            </div>
            <!-- location btn -->
            <div class="location d-flex" >
                <a target="_blank" :href="mapsUrl()" class="mapsBtn">
                    <img src="assets/icons/location.png" alt="distance">
                    <span>{{ t('shop.Location') }}</span>
                </a>
            </div>          
            <!-- Save shop -->
            <div class="save d-flex" @click.prevent="saveShop()">
                <img :test="!isShopSaved" :src="!isShopSaved ? 'assets/icons/mark-saved.png':'assets/icons/mark.png'" alt="distance">
                <span :style="!isShopSaved ? 'color: var(--background)':''">{{t('shop.save')}}</span>
            </div>
        </div>
        <!-- Body bottom Part -->
        <div class="body-bottom">
            <!-- Navigator -->
            <div class="navs d-flex justify-content-between align-items-center mx-auto px-3">
                <!-- battery-nav -->
                <div class="battery-nav selected" @click="switchView($event)" data-target="batteries">
                    <span>{{t('shop.battery')}}</span>
                    &nbsp;
                    <span class="battery-live" style="background-color: var(--background); padding: 0 4px; color: var(--color);">{{battery().busy}}</span>
                </div>
                <!-- menu-nav -->
                <div class="menu-nav" @click="switchView($event)" data-target="menus">
                    <span>{{t('shop.Menu & Discounts')}}</span>
                </div>          
                <!-- rate-nav -->
                <div class="rate-nav" @click="switchView($event)" data-target="rates">
                    <span>{{t('shop.rates')}}</span>
                </div>
            </div>
        </div>
        <!-- Bottom Content -->
        <div class="bottom-content">
            <!-- Batteries -->
            <div id="batteries" class="batteries p-3 target" v-if="battery().busy">
                <div class="d-flex flex-nowrap justify-content-evenly">
                    <div class="battery" v-for="i in battery().total" :key="i" :style="(i < battery().busy +1 ? 'background: var(--background);':'')">
                    <span>&nbsp;</span>
                    </div>
                </div>
                <!-- Batteries Data-->
                <div class="batteries-data d-flex justify-content-between w-100 pt-3">
                    <!-- Filled Batteries -->
                    <div class="filled-batteries d-flex align-items-center justify-content-center">
                    <img src="assets/icons/full-battery.png" style="width: 2rem;" alt="Filled Battery">
                    <span>{{t('shop.full-slots')}}</span>
                    <span style="color: var(--background);color: var(--background);font-size: 2rem;padding: 0 3px;margin-top: -10px;"> . </span>
                    <span>{{battery().busy}}</span>
                    </div>
                    <!-- Empty Batteries -->
                    <div class="empty-batteries d-flex align-items-center justify-content-center">
                    <img src="assets/icons/empty-battery.png" style="width: 2rem;" alt="Empty Battery">
                    <span>{{t('shop.empty-slots')}}</span>
                    <span style="color: var(--background);color: var(--background);font-size: 2rem;padding: 0 3px;margin-top: -10px;"> . </span>
                    <span>{{battery().empty}}</span>
                    </div>
                </div>
            </div>

            <div id="batteries" class="batteriestext-center target" v-else>
                <div v-if="(isDeviceOnline() === false || isDeviceOnline() === null || isShopOpen() === false || isShopOpen() === null) || battery().busy < 1">
                    <div id="batteries" class="batteries p-3 target">
                        <div class="d-flex flex-nowrap justify-content-evenly">
                            <div class="battery" v-for="i in modalData?.device?.slots ?? 6" :key="i" >
                                <span>&nbsp;</span>
                            </div>
                         </div>
                        <!-- Batteries Data-->
                        <div class="batteries-data d-flex justify-content-between w-100 pt-3">
                            <!-- Filled Batteries -->
                            <div class="filled-batteries d-flex align-items-center justify-content-center">
                            <img src="assets/icons/full-battery.png" style="width: 2rem;" alt="Filled Battery">
                            <span>{{t('shop.full-slots')}}</span>
                            <span style="color: var(--background);color: var(--background);font-size: 2rem;padding: 0 3px;margin-top: -10px;"> . </span>
                            <span>0</span>
                            </div>
                            <!-- Empty Batteries -->
                            <div class="empty-batteries d-flex align-items-center justify-content-center">
                            <img src="assets/icons/empty-battery.png" style="width: 2rem;" alt="Empty Battery">
                            <span>{{t('shop.empty-slots')}}</span>
                            <span style="color: var(--background);color: var(--background);font-size: 2rem;padding: 0 3px;margin-top: -10px;"> . </span>
                            <span class="test">{{modalData?.device?.slots ?? 6}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Menus -->
            <div id="menus" class="menus target"  style="display: none;">
                <div class="menus p-3 d-flex flex-row flex-nowrap" v-if="menu() !== null">
                    <div @click="viewMenu" v-if="galleryloaded" class="menu-image" v-for="i in menu()" :key="i">
                        <img :src="i.image" alt="menu image">
                    </div>
                    <div v-else class="d-flex justify-content-center w-100 text-center mt-5">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">{{t('Loading...')}}</span>
                        </div>
                    </div>
                </div>
                <div class="text-center mt-2" v-else>{{t('shop.no offers')}}</div>
            </div>
            <!-- Rates -->
            <div id="rates" class="rates target" style="display: none;">
                <Rates :data="modalData"/>
            </div>
        </div>
    </div>
</template>
<script>
import Rates from './shops/Rates.vue';
import { onMounted,ref,onUpdated } from 'vue';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import useToast from './../composition/useToast';
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';

export default {
    name: "ShopData",
    props: ['modalData', 'openScanner'],
    components: {
        Rates
    },
    setup(props) {
        const isShopSaved = ref(false);
        onMounted(() =>{
            isSaved();
            loadImages(4000);
        });

        onUpdated(() => {
            const targets = document.querySelectorAll('.target');
            const target = document.querySelector('.battery-nav').getAttribute('data-target');
            const targetsNavs = document.querySelectorAll('[data-target]');
            for (let i = 0; i < targets.length; i++) {
                targets[i].id === target ? targets[i].style.display = 'block' : targets[i].style.display = 'none';
                if (targetsNavs[i]?.getAttribute('data-target') === target) {
                        targetsNavs[i] ? targetsNavs[i]?.classList?.add('selected') : '';
                } else {
                    targetsNavs[i] ? targetsNavs[i]?.classList?.remove('selected') : '';
                }            
            }
        })
        const viewMenu = () => {
            document.getElementById('menus').addEventListener('hidden', () => {
               gallery.destroy();
            });

            const gallery = new Viewer(document.getElementById('menus'));
            gallery.show(true);
        }

        const switchView = (event) => {
            const targets = document.querySelectorAll('.target');
            const target = event.currentTarget.getAttribute('data-target');
            const targetsNavs = document.querySelectorAll('[data-target]');
            for (let i = 0; i < targets.length; i++) {
                targets[i].id === target ? targets[i].style.display = 'block' : targets[i].style.display = 'none';
                if (targetsNavs[i].getAttribute('data-target') === target) {
                        targetsNavs[i].classList.add('selected');
                } else {
                    targetsNavs[i].classList.remove('selected');
                }            
            }
        }

        // count user distance
        const userLocation = ref({ latitude: null, longitude: null });
        const userDistance = ref('');
        const toRadians = (degrees) => degrees * (Math.PI / 180);

        const haversineDistance = (userLocation, shopLocation) => {
            if (!userLocation || !shopLocation) {
                console.error("Invalid userLocation or shopLocation");
                return;
            }

            const R = 6371; // Earth's radius in kilometers

            const lat1 = userLocation.latitude;
            const lon1 = userLocation.longitude;
            const lat2 = shopLocation[0];
            const lon2 = shopLocation[1];

            const dLat = toRadians(lat2 - lat1);
            const dLon = toRadians(lon2 - lon1);

            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            const distance = R * c; // Distance in kilometers

            return distance;
        };

        const getUserDistance = (shopLocation) => {
            let distance = '';
            // Ensure shopLocation is a valid array with at least two elements
            if (shopLocation === null || shopLocation === undefined || !Array.isArray(shopLocation) || shopLocation.length < 2) {
                console.error("Invalid shopLocation");
                return;
            }
            // Get the user's current location
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Set the user's location
                    userLocation.value = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };

                    if (userLocation.value) {
                        const kmDistance = haversineDistance(userLocation.value, shopLocation);
                        distance = `${Number(kmDistance).toPrecision(2)} km`;
                        userDistance.value = distance;
                        return distance;
                    }
                },
                (error) => {
                    console.error("Error retrieving user location:", error);
                }
            );
            return distance;
        };

        
        const isShopOpen = () => {
            if(props.modalData?.data){
                const data = props.modalData?.data;
                const now = new Date();
                const currentDateString = now.toISOString().split('T')[0];
                const closeingTimeDateTime = data.closes_at ? new Date(`${currentDateString}T${data.closes_at}`) : null;
                return closeingTimeDateTime && now < closeingTimeDateTime && data.is_open === 'yes' ? true : (now < closeingTimeDateTime && data.is_open === 'yes' ? true : false);
            }
            return null;
        }

        const isDeviceOnline = () => {
            if(props.modalData?.device && props.modalData?.device?.device_id?.length > 0 && isShopOpen()){
                const devices = JSON.parse(localStorage.devices);
                const device = devices.find(device => device.DeviceId === props.modalData?.device?.device_id);
                console.log(device?.data);
                return device?.data !== undefined && device?.data?.cabinet?.online === true ? true : false;
            }
            return null;
        }

        // Maps Url
        const mapsUrl = () => {
            const location = props.modalData?.data?.location?.length > 0 ? props.modalData?.data?.location?.split(",") : props.modalData?.location?.split(",");
            const url = `https://www.google.com/maps/search/?api=1&query=${Array.isArray(location)  && location.length > 1 ? location[0] + ',' + location[1] : ''}`;
            console.log(props.modalData);

            return url;

        }

        // Handle Prices
        const lang = localStorage.locale;
        const { t } = useI18n();
        const price = () => {
            console.log(props.modalData);
            const prices = props.modalData?.data?.price ?? ( lang === 'ar' ? JSON.parse(localStorage.prices)[0][1] : JSON.parse(localStorage.prices)[0][2]);
            return prices;
        }

        // Battery section 
        const battery = () => {
            let data = {total: 0, busy: 0, empty: 0};
            data.total = props.modalData?.device?.slots;
            if(props.modalData?.slots){
                data = {
                    total: props.modalData?.slots?.totalSlots,
                    busy: props.modalData?.slots?.busySlots,
                    empty: props.modalData?.slots?.emptySlots
                }
            }
            return data;
        }

        // Menu section 
        const menu = () => {
            return props.modalData?.menu?.length > 0 ? props.modalData?.menu : null;
        }

        // save shop
        const { openToast } = useToast();
        const saveShop = async () => {
            const loggeduser = localStorage?.token ?? null;
            if(!loggeduser) { return openToast( t('validation.You should login first'), 'danger', 'bottom') };
            
            // send axios request
            axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
            const url = `${process.env.VUE_APP_API_URL}/api/operations/shops/save`;
            await isSaved();
            
            await axios.post(url,{shop_id: props.modalData.id})
            .then((res) => {
                openToast(isShopSaved.value ? t('shop.shop-removed-from-saved') : t('shop.shop-saved-successfully'), 'success', 'bottom');
                const savedShops = res.data;
                isShopSaved.value = savedShops.includes(props.modalData.id) ? true : false;
                // !isShopSaved.value ? isShopSaved(true) : null;
            })
            .catch((err) => {
                openToast(isShopSaved.value ? t('shop.cant-remove-shop-from-saved') : t('shop.cant-save-shop'), 'danger', 'bottom');
            });
        }

                // Check if shop is saved
        const isSaved = async () => {
            // Check if user is logged in
            const loggeduser = localStorage?.token ?? null;
            if(!loggeduser || props?.modalData?.id === undefined || props?.modalData?.id === null) { return; }
            
            // send axios request
            axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
            const url = `${process.env.VUE_APP_API_URL}/api/operations/shops/check-save`;
            await axios.post(url,{shop_id: props.modalData.id})
            .then((res) => {
                isShopSaved.value = res.data.includes(props.modalData.id) ? true : false;
            })
            .catch((err) => {
                // isShopSaved.value = false;
            });
            document.querySelector('div.save').classList.remove('d-none');
            return isShopSaved.value;
        }

        function convertTo12Hour(time) {
            let [hours, minutes] = time.split(':').map(Number);
            let period = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            let formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;

            return formattedTime;
        }

        const galleryloaded = ref(false);
        const loadImages = (time) => { setTimeout(() => { galleryloaded.value = true; }, time); }

        return { 
            switchView,
            getUserDistance,
            userDistance,
            isShopOpen,
            isDeviceOnline,
            mapsUrl,
            price,
            battery,
            menu,
            saveShop,
            viewMenu,
            lang,
            t,
            isShopSaved,
            convertTo12Hour,
            galleryloaded,
            t
        };
    }
}
</script>

<style scoped>
.offcanvas-header{
  padding: 10px 20px 0 0;
}
.offcanvas-body{
  padding: 0;
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
    .elipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 80%;
    }

    .device-status > div {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      font-size: .6rem;
      max-width: 100% !important;
    }

    .summary >div > div {
        max-width: 20%;
    }
    .summary {
      font-size: .7rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .body-top  img, .body-middle img
    {
      width: 1.3rem;
      height: 1.3rem;
      padding-right: 5px;
    }
    .body-top  > div, .body-middle  > div
    {
    font-size: .6rem;
    color: #474747;
    flex-basis: 30%;
    align-items: center;
    padding: 0 6px;
    }
    .body-top  > div > div > span:first-of-type,.body-middle {
      font-weight: 900;
    }
    .body-middle {
      font-size: .7rem !important;
      max-height: 30px;
    }
    .qr-scan {
      background: var(--background);
      border-top-right-radius: 10px;
      color: var(--color) !important;
    }
    .mapsBtn {
        /* prevent link style */
        text-decoration: none;
        color: #000;
    }
    .body-bottom
    {
      border: 1px solid #474747a1;
      border-radius: 15px;
      font-weight: bold;
      font-size: .7rem;
      padding: 5px 10px;
      width: 90%;
      margin: 0 auto;
    }
    .battery-nav {
      display: flex;
      justify-content: space-between;
    }
    .navs .selected {
      background-color: #dadada;
      color: var(--background);
      padding: 10px 15px;
      border-radius: 15px;
    }
    .battery {
      height: 6rem;
      width: 2rem;
      background: #dadada;
      display: flex;
      align-items: center;
      border-top-right-radius: 10px;
      border-top-left-radius: 10px;
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
    }

    .battery span {
      height: 2rem;
      width: 5px;
      display: block;
      text-align: center;
      background: var(--color);
      margin: 0 auto;
    }
    .menu-image {
      width: 10rem;
      max-width: 7rem;
      padding: 0 5px;
    }
    .img-thumbnail {
        width: 100px;
        margin: 5px;
        }
    .menu-image img {
        max-height: 200px;
    }
    @media (min-width: 768px) {
    .summary {
      font-size: 2rem;
    }
    .summary img {
      width: 2rem !important;
    }

    * {
      font-family: "abdo-master";
    }
}

</style>