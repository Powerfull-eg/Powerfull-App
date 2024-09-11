<template>
    <div class="buttons-container container w-100 ">
        <router-link class="position-absolute" style="top: 15rem;"  :to="{ name: 'Saved' }">
            <img  src="assets/icons/map-mark.png" alt="">
        </router-link>
        <router-link class="position-absolute" style="top: 20rem;"  :to="{ name: 'locations' }">
            <img  src="assets/icons/map-search.png" alt="">
        </router-link>
        <div id="get-location" class="position-absolute" style="bottom: 10rem;" >
            <img  src="assets/icons/map-location.png" alt="">
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
    name: "MapButtons",
    setup(){
        const router = useRouter();

        return {
            router
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