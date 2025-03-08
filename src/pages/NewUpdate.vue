<template>
  <base-layout hideHeader hideMenuBtn map loading="lazy">
    <div class="data">
        <h1 class="title">{{ updateTitle  }}</h1>
        <p class="message">
            {{ updateMessage  }}
           </p>
        <img src="/assets/images/update.svg" alt="Update">
        <div class="routes">
            <a class="btn btn-primary link" target="_blank" :href="appLink()">{{ t('Update') }}</a>
            <router-link style="color: #fff; text-decoration: none;" :to="{ name: userlogged ? 'home' : 'phone' }" v-if="!mandatory"> 
                <span> {{ t('Skip') }} </span>
            </router-link>
        </div>
    </div>
</base-layout>
</template>
<script>
import { useI18n } from 'vue-i18n';
import { ref,onMounted } from 'vue';
import {useRouter} from 'vue-router';
import { useStore } from 'vuex';
export default {
  
name: 'NewUpdate',
setup() {
    const router = useRouter();
    const { t } = useI18n();
    const lang = localStorage?.locale;
    const store = useStore();
    const platform = cordova.platformId;
    const settings = ref(store.getters["settings/settings"]);
    const userlogged = localStorage?.isAuth == 1 ? true : false;
    const AndroidLink = settings.value?.appAndroidLink ?? process.env.VUE_APP_ANDROID_LINK;
    const IosLink = settings.value?.appIosLink ?? process.env.VUE_APP_IOS_LINK;
    const appLink = () => { return platform == 'android' ? AndroidLink : IosLink;  }
    const appCurrentVerion = process.env.VUE_APP_CURRENT_VERSION;

    // Define if update is mandatory
    let mandatory = false;
    mandatory = platform == 'android' ?  settings.value.updateAndroidMandatory > appCurrentVerion : settings.value.updateIosMandatory > appCurrentVerion;
        
    let updateTitle = lang == 'ar' ? settings.value?.arUpdateTitle : settings.value?.enUpdateTitle;
    updateTitle = updateTitle ?? t('New Update');

    let updateMessage = lang == 'ar' ? settings.value?.arUpdateMessage : settings.value?.enUpdateMessage;
    updateMessage = updateMessage ?? t('Update Message');
    
    onMounted(() => {
        preventBack();
        console.log(mandatory);
    });
    
    const exitApp = () => {
        cordova.plugins.exit();
    }

    const preventBack = () => {
      document.addEventListener("backbutton", (e) => {
          e.preventDefault();
          mandatory ? exitApp() : router.push({ name: 'home' });
      }, false);
    }
    
    return { t,settings,router,appLink,mandatory,updateTitle,updateMessage,userlogged };
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
    margin: 4rem;
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