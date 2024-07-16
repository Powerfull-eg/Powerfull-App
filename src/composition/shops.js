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
        method: 'post',
        url: apiUrl,
        headers: { 
            "Accept" : "Application/json"
        }
    };

    await axios(config)
    .then(function (response) {
        console.log(response);
        if(response.data[0] == 200 && JSON.parse(response.data[1]).code == 0){
            shops = JSON.parse(response.data[1]).data
        }else{
            errMessages.push(JSON.parse(response.data[1]).msg)
        }        
        return;
    })
    .catch(function (error) {
        console.log(error);
        errMessages.push(error)
        return;
    });

    return errMessages.length > 0 ? console.log(errMessages) : localStorage.setItem("shops",JSON.stringify(shops));
}