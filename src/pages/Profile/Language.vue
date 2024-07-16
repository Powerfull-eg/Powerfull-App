<template>
<base-layout :pageTitle="t('settings.Language')" :show-menu-button="false">
        <LanguageComponent />
</base-layout>
</template>

<script>
import LanguageComponent from "./../../components/LanguageComponent.vue";
import { useI18n } from "vue-i18n"; 
export default {
    name:"Language",
    components: {
        LanguageComponent
    },
    setup(){
        const { t } = useI18n();
        
        return { t }
    }
}
</script>
<style scoped>
</style>