import "./connection";
import getShops from "./shops";
import getPrice from "./prices";
import getDevices from "./devices";
import auth from "./auth";
import sendPushToken from "./registerPushToken";
import store from '../store';

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