<template>
    <div class="buttons-container container w-100 ">
        <router-link class="position-absolute" style="top: 15rem;"  :to="{ name: 'Saved' }">
            <img  src="assets/icons/map-mark.png" alt="">
        </router-link>
        <router-link class="position-absolute" style="top: 20rem;"  :to="{ name: 'locations' }">
            <img  src="assets/icons/map-search.png" alt="">
        </router-link>
        <router-link class="position-absolute" style="top: 25rem;"  :to="{ name: 'Notifications' }">
            <img  src="assets/icons/map-notification.png" style="padding: 8px;" alt="">
            <div v-if="notificationsCount > 0" class='postiion-relative'>
                <span class="position-absolute top-100 translate-middle badge rounded-pill bg-danger" style="left: 10px;">
                    {{ notificationsCount }}
                </span>
            </div>
        </router-link>
        <div id="get-location" class="position-absolute" style="bottom: 10rem;" >
            <img  src="assets/icons/map-location.png" alt="">
        </div>
    </div>
</template>

<script>
import { useRouter,useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { ref,onMounted,watch } from 'vue';

export default {
    name: "MapButtons",
    setup(){
        const router = useRouter();
        const route = useRoute();
        const store = useStore();
        const notificationsCount = ref(0);
        const getNotificationsCount = () => {
            notificationsCount.value = store.getters['notifications/nonSeenCount'];
        }

        onMounted(() => {
            getNotificationsCount();
        });

        watch(() => route.fullPath, getNotificationsCount);

        return {
            router,
            notificationsCount
        }
    }
}
</script>

<style scoped>
.buttons-container a,.buttons-container div {
    z-index: 10;
    right: 10px;
}
.buttons-container a img,.buttons-container div img{
    width: 50px;
    background: #8080807d;
    padding: 0;
}
</style>