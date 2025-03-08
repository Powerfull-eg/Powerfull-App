<template>
    <div id="lottie-container" class="">
        <div>
            <lottie-player src="/assets/vectors/powerfull-loader.json" background="transparent" speed="1" direction="1" mode="normal" autoplay></lottie-player>
        </div>
        <div class="mx-auto m-5 spinner-container">
            <ion-spinner name="dots" style="display:none"></ion-spinner>
        </div>
    </div>
</template>

<script>
import "../utils/lottie.js";
import { IonSpinner } from '@ionic/vue';
import { ref,onMounted } from "vue";
export default {
    name: "Loader",
    components :{
        IonSpinner
    },
    setup(){
        onMounted(()=>{
            
        });
    }
}
</script>

<style scoped>

#lottie-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  z-index: 10;
  /* background: #eae9e9; Android Only */
}
/* for ios */
/* #lottie-container lottie-player {
    max-width: 50%;
}

#lottie-container lottie-player {
  max-height: 100%; 
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #e7741a;
} */

#lottie-container video {
  max-height: 75%; 
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.spinner-container {
    position: fixed;
    bottom: 20px;
    z-index: 12;
}
ion-spinner {
    height: 100px;
    width: 50px;
    --color: var(--main-color-light);
}
</style>