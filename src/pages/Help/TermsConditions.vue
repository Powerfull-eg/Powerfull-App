<template>
<base-layout :show-menu-button="false" :pageTitle="t('Terms & Conditions')" loading="lazy">
<div class="page-container">
    <router-link class="link" to="/terms">{{t('Terms & Conditions')}} <ion-icon style="vertical-align: middle; font-size: 2rem;" :icon="Icons.chevronForwardOutline"></ion-icon></router-link>
    <router-link class="link" to="/privacy">{{t('Privacy Policy')}}<ion-icon style="vertical-align: middle; font-size: 2rem;" :icon="Icons.chevronForwardOutline"></ion-icon></router-link>
    <!-- <router-link class="link" to="/Faqs">Sales Contract <ion-icon style="vertical-align: middle; font-size: 2rem;" :icon="Icons.chevronForwardOutline"></ion-icon></router-link> -->
</div>
</base-layout>
</template>

<script>
import { caretUpOutline, caretDownOutline, chevronForwardOutline } from 'ionicons/icons';
// import { ref } from 'vue';
import { IonIcon } from '@ionic/vue';
import { useI18n } from 'vue-i18n';
export default {
  name: 'TermsConditions',
  components: {
    IonIcon,
  },
  setup() {
    const {t} = useI18n();
    const Icons = { caretUpOutline, caretDownOutline, chevronForwardOutline };

    return { Icons, t };
  },
};
</script>

<style scoped>
.page-container {
    width: 75%;
    margin: 0 auto;
    text-align: center;
}

.link {
    text-align: center;
    border: 2px solid var(--color);
    padding: 1rem;
    margin: 3rem auto;
    border-radius: 30px;
    width: 100%;
    display: flex;
    color: unset;
    text-decoration: unset;
    font-size: 1.2rem;
    font-weight: 500;
    justify-content: space-around;
}
</style>