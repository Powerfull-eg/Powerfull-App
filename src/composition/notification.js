export default function(){
    setTimeout(() => {
        
    if(device.platform == "iOS"){
        cordova.plugins.firebase.messaging.requestPermission();
    }

    cordova.plugins.firebase.messaging.getToken().then(function(token){
        console.log(token);
        // const axios = require('axios');
        // const url = `${process.env.VUE_APP_API_URL}/api/operations/notification-token`;
        // axios.post(url,{token:token})
        // .then(function (response) {
        //     console.log(response)
        // })
        // .catch(err => console.log(err));
    }).catch(err => console.log(err));
}, 1500);
}