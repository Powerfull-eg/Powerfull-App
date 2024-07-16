import "./connection";
import getShops from "./shops";
import getPrice from "./prices";
import getDevices from "./devices";
import auth from "./auth";
import sendPushToken from "./registerPushToken";

const serverData = setInterval(() => {
    getDevices();
    getShops();
    getPrice();
}, 300000);

getDevices();
getShops();
getPrice();
sendPushToken();
auth();