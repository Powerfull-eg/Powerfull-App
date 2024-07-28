<template>
  <base-layout hideHeader hideMenuBtn map loading="lazy">
    <div class="maintenance">
        <h1 class="title">{{ t('Under Maintenance') }}</h1>
        <p class="message">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum neque molestias iste incidunt ullam est sit praesentium at. Aperiam delectus, necessitatibus dicta molestias fugit pariatur quae repellat magni officia at!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum neque molestias iste incidunt ullam est sit praesentium at. Aperiam delectus, necessitatibus dicta molestias fugit pariatur quae repellat magni officia at!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum neque molestias iste incidunt ullam est sit praesentium at. Aperiam delectus, necessitatibus dicta molestias fugit pariatur quae repellat magni officia at!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum neque molestias iste incidunt ullam est sit praesentium at. Aperiam delectus, necessitatibus dicta molestias fugit pariatur quae repellat magni officia at!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum neque molestias iste incidunt ullam est sit praesentium at. Aperiam delectus, necessitatibus dicta molestias fugit pariatur quae repellat magni officia at!
        </p>
        <img src="/assets/images/Maintenance.svg" alt="Maintenance">
        <button class="btn btn-primary" @click="exitApp()">{{ t('Exit') }}</button>
    </div>
</base-layout>
</template>
<script>
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';
import {useRouter} from 'vue-router';
export default {
  
name: 'Maintenance',
setup() {
    const router = useRouter();
    const { t } = useI18n();
    const exitApp = () => { cordova.plugins.exit(); }

    onMounted(() => {
        router.beforeEach((to, from, next) => {
            exitApp();
            next();
        });
    });
    
    return { t, exitApp };
}
}
</script>

<style scoped>
.maintenance {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.maintenance h1 {
    font-size: 2.5rem;
    margin: 2rem;
}

.maintenance p.message {
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

.maintenance img {
    width: 50%;
    margin: 2rem;
}

.maintenance button {
    margin: 2rem;
    padding: 10px 30px;
    font-size: 1.2rem;
    border-radius: 10px;
    border: none;
    background-color: #fff;
    color: #f27920;
}
</style>