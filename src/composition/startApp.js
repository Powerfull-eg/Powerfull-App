import "./connection";
import getShops from "./shops";
import getPrice from "./prices";
import getDevices from "./devices";
import auth from "./auth";
import sendPushToken from "./registerPushToken";
import store from '../store';

function startApp() {
    const serverData = setInterval(() => {
        getDevices();
        getShops();
        getPrice();
    }, 300000);
    
    store.dispatch('settings/fetchSettings');
    getDevices();
    getShops();
    getPrice();
    sendPushToken();
    auth();
}

function getTargetStartPage(){
    const settings = store.getters["settings/settings"];
    // Check for new clients
    let target = localStorage?.oldGuest != true ? 'Intro' : localStorage.isAuth == true ? 'home' : 'phone';
    // Check for maintenance exists
    target = settings.maintenance ?  'Maintenance' : target;
    // Check for Update exists
    const platform = 'ios'; //cordova.device.platform;
    const settingsVersion = platform == 'ios' ? settings?.appIosVersion?.version : settings?.appAndroidVersion?.version;
    if(settingsVersion){
        const appCurrentVerion = '1.2.3';// 
        target = appCurrentVerion < settingsVersion ?  'Update'  : target;
    }
    return target;
}

export { startApp, getTargetStartPage };