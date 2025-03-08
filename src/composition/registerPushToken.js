import axios from "axios";
import user from "../store/modules/user";

export default  function sendPushToken() {
    setTimeout(async () => {
        
        let token;
        if(cordova.platformId === "ios"){
            await cordova.plugins.firebase.messaging.requestPermission().then(t =>{ console.log(t); token = t}).catch(err => console.log(err))    
        }
        await cordova.plugins.firebase.messaging.getToken().then(t =>{ console.log(t); token = t}).catch(err => console.log(err))    
        const userId = JSON.parse(localStorage?.userData ?? "{}")?.id;
        const deviceuid = device.uuid
        const url = `${process.env.VUE_APP_API_URL}/api/push-token/upsert`;
        
        await axios.post(url, { token:token, userId:userId, device:deviceuid })
        .then(res => console.log(res, "Token Registerd"))
        .catch(err => console.log(err, "Token Not Registerd"))
    }, 3000);
}