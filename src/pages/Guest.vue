<template>
<base-layout :show-menu-button="true">
        
    <div class="d-flex flex-column mt-5" :style="lang === 'ar' ? 'direction:rtl': 'direction:ltr'">
        <div class="notes mt-5">
            <h6 style="font-weight: 500;"> {{ t("guest.When you continue as a guest:") }}</h6>
            <ul>
                <li>{{ t("guest.You cannot rent powerbank") }}</li>
                <li>{{ t("guest.You will not be able to see our campaigns") }}</li>
            </ul>
        </div>
        <div class="redirect-buttons d-flex flex-column m-3">
            <router-link to="/phone" class="link">
                {{ t("guest.Back to login") }}
            </router-link>
            <router-link to="/home" class="link">
                {{ t("guest.Continue as guest") }}
            </router-link>
        </div>
    </div>
</base-layout>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
    name: "Guest",
    setup(){
        const {t} = useI18n();
        const lang = localStorage.locale
        return { t,lang }
    }
}
</script>

<style scoped>
div.notes {
    margin: 0 20px;
    text-align: justify;
    margin-top: 25px;
}
div.redirect-buttons > a {
    border-radius: 50px;
    font-weight: 600;
}

.link {
  text-align: center;
  border: 2px solid var(--color);
  padding: 1rem;
  margin: 1.5rem 0;
  border-radius: 30px;
  width: 90%;
  display: block;
  color: unset;
  text-decoration: unset;
  font-size: 1.2rem;
  font-weight: 500;
  align-items: center;
  background: var(--color);
  color: black;
}
</style>