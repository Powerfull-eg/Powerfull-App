import "./connection";
import getShops from "./shops";
import getPrice from "./prices";
import getDevices from "./devices";
import auth from "./auth";
import sendPushToken from "./registerPushToken";
import store from '../store';

auth();

function startApp() {
    const serverData = setInterval(() => {
        getDevices();
        getShops();
        getPrice();
    }, 300000);
    
    store.dispatch('settings/fetchSettings');
    
    if(localStorage?.isAuth){
        store.dispatch('notifications/fetchNonSeenNotification');
    }

    getDevices();
    getShops();
    getPrice();
    sendPushToken();
}

function getTargetStartPage(){
    const settings = store.getters["settings/settings"];
    // Check for new clients
    let target = localStorage?.oldGuest != true ? 'Intro' : localStorage.isAuth == true ? 'home' : 'phone';
    // Check for maintenance exists
    target = settings.maintenance ?  'Maintenance' : target;
    // Check for Update exists
    const platform = cordova.platformId;
    const settingsVersion = platform == 'ios' ? settings?.appIosVersion : settings?.appAndroidVersion;
    if(settingsVersion){
        const appCurrentVerion = process.env.VUE_APP_CURRENT_VERSION;
        target = appCurrentVerion < settingsVersion ?  'NewUpdate'  : target;
    }
    return target;
}

export { startApp, getTargetStartPage };