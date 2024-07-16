export default async function getDevices() {
    require('dotenv').config();

    let devices;
    let errMessages = [];
    const online = navigator.onLine;
    
    if(!online){
        errMessages.push("No Internet Connection!");
        return;
    }  

   const apiUrl = `${process.env.VUE_APP_API_URL}/api/devices`;
   const axios = require('axios');

    const config = {
        method: 'post',
        url: apiUrl,
        headers: { 
            "Accept" : "Application/json"
        }
    };

    await axios(config)
    .then(function (response) {
        console.log(response);
        devices = response.data;       
        return;
    })
    .catch(function (error) {
        console.log(error);
        errMessages.push(error)
        return;
    });
    
    return errMessages.length > 0 ? errmessages : localStorage.setItem("devices",JSON.stringify(devices));
}