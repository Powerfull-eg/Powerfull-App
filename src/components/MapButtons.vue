<template>
    <div class="buttons-container container w-100 ">
        <router-link class="position-absolute" style="top: 15rem;"  :to="{ name: 'Saved' }">
            <img  src="assets/icons/mark.png" alt="">
        </router-link>
        <router-link class="position-absolute" style="top: 18rem;"  :to="{ name: 'Wallet' }">
            <img  src="assets/icons/mark.png" alt="">
        </router-link>
        <router-link class="position-absolute" style="bottom: 10rem;"  :to="{ name: 'Wallet' }">
            <img  src="assets/icons/mark.png" alt="">
        </router-link>
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
.buttons-container a {
    z-index: 10;
    right: 10px;
}
.buttons-container a img{
    width: 20px;
    background: #8080807d;
    padding: 10px;
}
</style>