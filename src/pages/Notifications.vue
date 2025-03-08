<template>
    <base-layout :pageTitle="t('Notifications')" :show-menu-button="false" loading="lazy">
    <div v-if="loader || error">
      <div v-if="loader" class="loader">
        <div class="spinner-border" role="status"></div>
        <span class="text-center d-block my-3">{{ t('Loading') }}...</span>
      </div>
      <div v-else class="result my-5">
        <span :class="'mt-3 d-block text-center text-white fs-5'">{{ t('Something went wrong Please try again')
        }}</span>
      </div>
    </div>
    <div v-else class="notifications-container w-100 row my-4">
      <div v-if="notifications.length <= 0" class="no-content text-center my-5">
        <h4 style="font-weight: 600; margin: 20px;"> {{ t('No Notifications Available') }}</h4>
      </div>
      <div v-else class="d-flex flex-column justify-content-center align-items-center">
        <div class="notification my-3" :style="lang == 'ar' ? 'direction: rtl' : ''" @click="collapse(notification.id,notification.seen == 1 ? false : true)" v-for="notification in notifications" :key="notification.id">    
          <!-- Visible Content -->
          <div :id="`content1-${notification.id}`" :class="'content1 collapse show  d-flex flex-row justify-content-between' + (notification?.seen == 0 ? '' : ' seen')">
                    <div class="d-flex flex-column ms-3 w-50">
                        <span :class="'title fs-4 fw-bold text-truncate'">{{ notification?.title }}</span>
                        <span :class="'body fs-5 text-truncate'">{{ notification?.body }}</span>
                    </div>
                    <div class="notification-image"><img :src="notification?.image ?? '/assets/images/powericon.png'" width="100" height="100" alt=""></div>
                </div>

                <!-- Collapsed Content -->
                <div :id="`content2-${notification.id}`" class="content2 collapse hide">
                  <div class="d-flex flex-column ms-3 w-75">
                    <span class="title fw-bold text-dark">{{ notification?.title }}</span>
                    <span class="body text-dark">{{ notification?.body }}</span>
                  </div>
                  <div class="notification-image p-2 text-center"><img :src="notification?.image ?? '/assets/images/powericon.png'" width="250" alt=""></div>
                  <router-link :to="{ name: notification?.data?.page ?? 'home'}" class="btn btn-warning mx-auto d-block w-50 text-center" style="background-color: var(--background);"> {{ notification?.data?.btnTextAr || notification?.data?.btnTextAr ? (lang == 'ar' && notification?.data?.btnTextAr ? notification?.data?.btnTextAr : notification?.data?.btnTextEn) : t('Get It Now')  }}
                  </router-link>
                </div>

        </div>
      </div>
    </div>
    </base-layout>
</template>
<script>
import axios from 'axios';
import { ref,onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { chevronUpOutline, chevronDownOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';
import  { useStore } from 'vuex';

export default {
    name: "Notifications",
    setup() {
        const router = useRouter();
        const { t } = useI18n();
        const notifications = ref([]);
        const loader = ref(true);
        const error = ref(false);
        const store = useStore();
        const lang = localStorage?.locale;

        onMounted(() => { getNotifications(); });

        const getNotifications = async () => {
            if(!localStorage.token) return;

            await store.dispatch('notifications/fetchNotifications');
            notifications.value = store.getters["notifications/notifications"];
            setTimeout(() => { loader.value = false; }, 2000);
        };

        // Collapse Notification
        const collapse = (id,read=false) => {
            const content1 = document.querySelector(`#content1-${id}`);
            const content2 = document.querySelector(`#content2-${id}`);
            content1.classList.toggle('show');
            content1.classList.toggle('hide');
            
            content2.classList.toggle('show');
            content2.classList.toggle('hide');

            // Read Notification
            read ? readNotification(id) : '';
        }
        
        // Read Notification
        const readNotification = (id) => {
            const url = process.env.VUE_APP_API_URL + "/api/operations/push-notifications/" + id;
            axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
            axios.put(url).then((response) => {
                document.querySelector(`#content1-${id}`).classList.contains('seen') ? '' : document.querySelector(`#content1-${id}`).classList.add('seen');
                store.dispatch('notifications/fetchNonSeenNotification');
            }).catch((error) => {
                error.value = true;
            });
        }
        const Icons = { chevronUpOutline, chevronDownOutline };

        return {
            notifications,
            loader,
            error,
            t,
            Icons,
            collapse,
            lang
        };
    }
}
</script>
<style>
.loader {
  text-align: center;
  margin: 10rem auto;
}

.notifications-container {
  margin-bottom: 40% !important;
}

.notification {
  border-radius: 20px;
  text-align: start;
  padding: 10px 20px;
  width: 90%;
  font-size: 1rem;
  background: var(--color);
  box-shadow: #00000080 0px 4px 10px 0px;
  position: relative;
}

.notification div.body {
  font-size: 20px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 60%;
  color: #000;
}
.notification a {
  text-decoration: unset;
  color: unset;
}
.notification div.title {
  font-size: 20px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 60%;
  color: #000;
}
.notification div.notification-image {
}
.collapse.hide {
  display: none !important;
}
div.content1.seen {
    color: #2d2d2d80 !important;
}
div.content1.seen img {
    filter: grayscale(100%) !important;
}

div.content1:not(.seen) {
    color: #000 !important;
}
</style>