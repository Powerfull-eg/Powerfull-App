import axios from "axios";
import user from "../store/modules/user";

export default  function sendPushToken() {
    setTimeout(async () => {
        
        let token;
        if(cordova.platformId === "ios"){
            await cordova.plugins.firebase.messaging.requestPermission().then(t =>{ console.log(t); token = t}).catch(err => console.log(err))    
        }
        await cordova.plugins.firebase.messaging.getToken().then(t =>{ console.log(t); token = t}).catch(err => console.log(err))    
        // const token = "c8yT6yj9P5M:APA91bHDA3jS9j4Gcss9GK4RzZlGK7Gc9GK4RzZlGK7Gc9GK4RzZlGK7Gc9GK4RzZlGK7Gc9GK4RzZlGK7Gc9GK4RzZlGK7Gc9GK4RzZlGK7Gc9GK4RzZlGK7Gc9GK4RzZlGK7Gc9GK4RzZlGK7Gc9GK4RzZlGK7Gc9GK4RzZlGK7Gc9GK4RzZlGK7";
        const userId = JSON.parse(localStorage?.userData ?? "{}")?.id;
        const deviceuid = device.uuid
        // const device = navigator.userAgent;
        const url = `${process.env.VUE_APP_API_URL}/api/push-token/upsert`;
        
        await axios.post(url, { token:token, userId:userId, device:deviceuid })
        .then(res => console.log(res, "Token Registerd"))
        .catch(err => console.log(err, "Token Not Registerd"))


        const url2 = `https://powerfull-eg.online/api/whats`;
        await axios.get(url2)
        .then(res => console.log(res, "Message Sent"))
        .catch(err => console.log(err, "Message Not Sent"))
    }, 3000);
}