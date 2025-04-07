import "./connection";
import getShops from "./shops";
import getPrice from "./prices";
import getDevices from "./devices";
import auth from "./auth";
import sendPushToken from "./registerPushToken";
import store from '../store';
import axios from "axios";

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
    checkExpiredOrUsedVouchers();
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

// Check for expired or used vouchers
async function checkExpiredOrUsedVouchers() {
    const voucher = JSON.parse(localStorage?.selectedVoucher ?? null) ?? null;
    if(voucher && localStorage?.isAuth){
        axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.token).token}`;
        const url = `${process.env.VUE_APP_API_URL}/api/operations/vouchers/${voucher.id}`;
        await axios.get(url)
        .then(res => {
            if( (new Date) > new Date(res.data.voucher.to) || res.data.voucher.used == 1 ) {
                localStorage.selectedVoucher = null;
            }
        }).catch(err => {console.log(err); localStorage.selectedVoucher = null});
        return;
    }
    localStorage.selectedVoucher = null;
}

export { startApp, getTargetStartPage };