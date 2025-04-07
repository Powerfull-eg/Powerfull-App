<template>

</template>

<script>
import { alertController } from '@ionic/vue';
import { ref,onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
    name: "NotificationAlert",
    setup() {
    const alertContent = ref(null);
    const { t } = useI18n();
    const lang = localStorage.locale;
    
    const allowNotification = (platform) => {
        switch (platform) {
            case 'android' :
                cordova.plugins.diagnostic.getPermissionAuthorizationStatus(
                    // success callback
                    s => {
                    if (s === cordova.plugins.diagnostic.permissionStatus.GRANTED) {
                        console.log("Notifications are enabled");
                    } else {
                        presentAlert();
                    }
                },
                // error callback
                e => console.log(e),
                // permission
                cordova.plugins.diagnostic.permission.POST_NOTIFICATIONS
                )
                break;
        }
    }
    
    const alertButtons = [
            {
                text: t('Cancel'),
                role: 'cancel',
                handler: () => {
                    console.log('Notification alert canceled');
                },
            },
            {
                text: t('Submit'),
                role: 'confirm',
                handler: () => {
                    cordova.plugins.diagnostic.switchToSettings();
                },
            },
        ];

    const presentAlert = async () => {
        const alert = await alertController.create({
        header: t('Notifications'),
        message: t('Notifications Alert Message'),
        buttons: alertButtons,
        cssClass: lang == 'ar' ? 'notification-alert-ar' : 'notification-alert',
        });

        await alert.present();
    };

    onMounted(() => {
        allowNotification(cordova.platformId);
    });

        return {}
    }
}
</script>

<style>
.notification-alert-ar{
    direction: rtl;
}
</style>