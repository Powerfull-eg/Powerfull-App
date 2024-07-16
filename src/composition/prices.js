export default async function getPrice() {
    const online = navigator.onLine;
    let errMessages = [];
    let prices;
    if(!online){
        errMessages.push("No Internet Connection!");
    }  

   const apiUrl = `${process.env.VUE_APP_API_URL}/api/price`;
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
        prices = response.data;
        return;
    })
    .catch(function (error) {
        console.log(error);
        errMessages.push(error)
        return;
    });
    
    return localStorage.setItem("prices",prices ?  JSON.stringify(prices) : '');
}