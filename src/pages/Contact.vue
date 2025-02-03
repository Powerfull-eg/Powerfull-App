<template>
  <base-layout page-default-back-link="/home" :show-menu-button="false" :pageTitle="t('Contact Us')" >
    <ion-row class="my-5">
      <ion-col size="12">
        <a class="d-flex align-items-center no-text-decoration mb-4 mt-3 contact" :href="`tel:+201001822192`" target="_blank">
          <ion-icon :icon="Icon.call" class="mr-2 fs-24"></ion-icon>
          {{ t("Conntact via phone") }}
        </a>
        <a class="d-flex align-items-center no-text-decoration contact" :href="`mailto:support@powerfull-eg.com`" target="_blank">
          <ion-icon :icon="Icon.mail" class="mr-2 fs-24"></ion-icon>
          {{ t("Send us an Email") }}
        </a>
      </ion-col>
      <ion-col class="text-center mx-auto" size="6">
        <WhatsappButton
          class="my-4"
          message="Hi, I need help with the powerfull App"
          target="_blank"
        />
      </ion-col>
      <!-- <ion-col size="12">
        <iframe
          class="mb-4"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d101408.21722940248!2d-122.15130702796334!3d37.41331444145766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb7495bec0189%3A0x7c17d44a466baf9b!2sMountain%20View%2C%20CA%2C%20USA!5e0!3m2!1sen!2sbr!4v1630859756274!5m2!1sen!2sbr"
          width="100%"
          height="100%"
          style="border: 0"
          allowfullscreen=""
          loading="lazy"
        >
        </iframe>
      </ion-col> -->
      <ion-col size="12" class="mt-4 ion-text-center">
        <ion-text class="fs-20"> {{ t("Social Media") }} </ion-text>
        <br />
      </ion-col>
      <ion-col
        size="12"
        class="d-flex align-items-center justify-content-around"
      >
        <a class="social" href="https://www.facebook.com/powerfull.eg" target="_blank">
          <ion-icon :icon="Icon.logoFacebook" class="fs-32"></ion-icon>
        </a>
        <a class="social" href="https://www.instagram.com/powerfull.eg?igsh=NnBjbm5vaDZpbzBi" target="_blank">
          <ion-icon :icon="Icon.logoInstagram" class="fs-32"></ion-icon>
        </a>
        <a class="social" href="https://powerfull-eg.com/" target="_blank">
          <ion-icon :icon="Icon.globeOutline" class="fs-32"></ion-icon>
        </a>
      </ion-col>
    </ion-row>
  </base-layout>
</template>

<script>
import { IonIcon } from "@ionic/vue";
import {
  call,
  mail,
  logoFacebook,
  logoInstagram,
  logoYoutube,
  globeOutline
} from "ionicons/icons";
import { ref } from "vue";
import { mapGetters } from "vuex";
import { useI18n } from 'vue-i18n';
import WhatsappButton from "../components/whatsapp/SendMessage.vue";

export default {
  components: {
    WhatsappButton,
    IonIcon,
  },
  computed: {
    ...mapGetters("general", ["getWhatsappTelephone", "getContactEmail"]),
  },
  setup() {
    const Icon = ref({
      logoInstagram,
      logoFacebook,
      logoYoutube,
      globeOutline,
      call,
      mail,
    });
    const { t } = useI18n();
    return {
      Icon,
      t
    };
  },
};
</script>

<style scoped>
  a.contact {
    background: #f68d41;
    padding: 20px;
    border-radius: 20px;
    width: 88%;
    color: white;
    font-size: 20px;
    font-weight: 600;
    /* font-family: cursive; */
  }
  a.social {
    color: #ffffff;
  }
</style>
