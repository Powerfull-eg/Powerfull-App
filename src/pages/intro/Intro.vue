<template>
<base-layout hideHeader hideMenuBtn map>
<div id="myCarousel" class="carousel h-100" data-bs-slide-to="0">

    <div class="direction" type="button" @click="carousel.next()"  style="right: 0;"> Next <ion-icon :icon="Icons.chevronForwardOutline"></ion-icon></div>
    <div class="direction" type="button" @click="carousel.prev()" style="left: 0;"> <ion-icon :icon="Icons.chevronBackOutline"></ion-icon> Previous</div>

  <div class="carousel-inner h-100">
    <div v-if="!oldGuest" class="carousel-item active h-100">
      <LanguageComponent />
    </div>
    <div class="carousel-item active h-100">
      <img src="/assets/images/intro/1.png" class="d-block h-100" alt="">
    </div>
    <div class="carousel-item h-100">
      <img src="/assets/images/intro/2.png" class="d-block h-100" alt="">
    </div>
    <div class="carousel-item h-100 position-relative">
      <img src="/assets/images/intro/3.png" class="d-block h-100" alt="">
      <router-link :to="target"><div type="button" class="start">Start Now</div></router-link>
    </div>
    <!-- <div class="carousel-item h-100 position-relative">
      <img src="/assets/images/intro/4.png" class="d-block w-100 h-100" alt="">
    </div> -->
  </div>
</div>
<router-link :to="target" class="skip">Skip</router-link>
</base-layout>
</template>

<script>
import { onMounted, onUnmounted, onUpdated, ref } from 'vue';
import { IonIcon } from "@ionic/vue";
import * as bootstrap from 'bootstrap';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import LanguageComponent from "./../../components/LanguageComponent.vue";
export default {
  name: 'Intro',
  components: {
    IonIcon,
    LanguageComponent
  },
  setup() {
    const target = ref(null);
    const carousel = ref(null);
    const Icons = { chevronBackOutline, chevronForwardOutline };
    target.value = localStorage?.isAuth == true ? 'home' : 'phone';
    onMounted(() => {
      localStorage.setItem('oldGuest', 1);
      carousel.value = new bootstrap.Carousel(document.querySelector('#myCarousel'), { wrap:false });
    });
    onUpdated(() => { carousel.value.to(0); });
    onUnmounted(() => { target.value = 'home'; });
    const oldGuest = ref(localStorage.getItem("oldGuest"));
    return { target, carousel, Icons, oldGuest };
  },
};
</script>

<style>
.carousel-indicators {
    margin-top: 1rem !important;
    bottom: unset !important;
    top:0 !important;
}
a.skip {
    position: absolute;
    bottom: 30px;
    left: 30px;
    color: #fff;
    z-index: 5;

}
div.direction {
  position: absolute;
  top: 20px;
  font-size: 20px;
  font-weight: 600;
  z-index: 5;
  margin: 0 10px;
}
ion-icon {
    font-size: 30px;
    vertical-align: bottom;
}
div.start {
    position: absolute;
    z-index: 5;
    font-size: 20px;
    bottom: 4rem;
    width: 75%;
    text-align: center;
    background: #000;
    padding: 1rem;
    margin: 0 2.5rem;
    border-radius: 2rem;
    color: var(--color);
}

/* Ipad pro*/
@media screen and (min-width: 550px) {
  .carousel-item img {
      max-width: fit-content !important;
      display: block;
      margin: 0 auto;
  }
}
</style>