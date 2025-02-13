<template>
  <base-layout hideHeader hideMenuBtn map loading="lazy">
    <div class="data">
        <h1 class="title">{{ t(settings?.updateTitle) ?? t('New Update') }}</h1>
        <p class="message">
            {{ t(settings?.updateMessage) ?? t('Update Message') }}
           </p>
        <img src="/assets/images/Maintenance.svg" alt="Maintenance">
        <div class="routes">
            <a class="btn btn-primary link" target="_blank" :href="appLink()">{{ t('Exit') }}</a>
            <a v-if="settings?.man" href=""></a>
        </div>
    </div>
</base-layout>
</template>
<script>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import {useRouter} from 'vue-router';
import { useStore } from 'vuex';
export default {
  
name: 'NewUpdate',
setup() {
    const router = useRouter();
    const { t } = useI18n();
    const exitApp = () => { cordova.plugins.exit(); }
    const platform = 'ios'; //cordova.device.platform;
    const AndroidLink = settings.value?.appAndroidLink ?? process.env.VUE_APP_ANDROID_LINK;
    const IosLink = settings.value?.appIosLink ?? process.env.VUE_APP_IOS_LINK;
    const appLink = () => { return platform == 'ios' ? AndroidLink : IosLink;  }
    const store = useStore();
    const settings = ref(store.getters["settings/settings"]);
    
    return { t, exitApp,settings,router,appLink };
}
}
</script>

<style scoped>
.data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.data h1 {
    font-size: 2.5rem;
    margin: 2rem;
}

.data p.message {
    font-size: 1.5rem;
    margin: 1rem;
    text-align: center;
    line-height: 2rem;
    /* max lines to show */
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
}

.data img {
    width: 50%;
    margin: 2rem;
}

.data .routes a.link {
    margin: 2rem;
    padding: 10px 30px;
    font-size: 1.2rem;
    border-radius: 10px;
    border: none;
    background-color: #fff;
    color: #f27920;
}
</style>