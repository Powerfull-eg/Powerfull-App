export default async function getShops() {
    require('dotenv').config();

    let shops;
    let errMessages = [];
    const online = navigator.onLine;
    
    if(!online){
        errMessages.push("No Internet Connection!");
        return;
    }

   const apiUrl = `${process.env.VUE_APP_API_URL}/api/shops`;
   const axios = require('axios');

    const config = {
        method: 'get',
        url: apiUrl,
        headers: { 
            "Accept" : "Application/json"
        }
    };

    await axios(config)
    .then(function (response) {
        console.log(response);
        shops = response.data;
    })
    .catch(function (error) {
        console.log(error);
        errMessages.push(error)
        return;
    });

    return errMessages.length > 0 ? console.log(errMessages) : localStorage.setItem("shops",JSON.stringify(shops));
}