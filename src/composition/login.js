export default async function login(data) {
  let errMessages = [];
  let responseData;
  const requiredValues= ["password"]
  const axios = require('axios');
  let apiUrl;
  let emailExist;
  // Check Internet
  if(!navigator.onLine){
    errMessages.push(`You should be online to complete login.`);
    return;
  }

  // Validate data
    // validate email 
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonepattern = /^(10|11|12|15)\d{8}$/;
    const passwordPattern = /^.{8,}$/;

    // check if input isn't empty
    if(data.emailPhone === 'undefined' || data.emailPhone === 'null'){
      errMessages.push(` the email or phone input shouldn't be empty`);
    }
    else if(data.password === 'undefined' || data.password === 'null'){
      errMessages.push(`the password shouldn't be empty`);
    }
    console.log(data.emailPhone,typeof data.emailPhone)
    // check if input is email or phone
    if(!emailPattern.test(data.emailPhone) && !phonepattern.test(data.emailPhone)){
      errMessages.push(`The entered Email or Phone number isn't correct`);
    }else if(emailPattern.test(data.emailPhone)){
      data.email = data.emailPhone;
      emailExist= true;
    }else if(phonepattern.test(data.emailPhone)){
      data.phone = data.emailPhone;
      emailExist = false;
    }

    if(!errMessages.length){

      apiUrl = `${process.env.VUE_APP_API_URL}/api/${emailExist ? 'checkemail':'checkphone'}`;
      let reqData = emailExist ? {email: data.email} : {phone: data.phone}; 
      await axios.post(apiUrl,reqData)
      .then(function (response) {
          if(response.data === 0){
            errMessages.push(`${emailExist ? 'Email address' : 'Phone number'} isn't exist`);
            return;
          }
      })
      .catch(function (error) {
          errMessages.push("Failed to connect the server, Please try agian")
          return;
      });
  
      //stoping from sending register request 
      if(errMessages.length){
        return {status: "fail",data: errMessages[0]};
      }
      
      // If no errors -- send request
  
      apiUrl = `${process.env.VUE_APP_API_URL}/api/login`;
        await axios.post(apiUrl,data)
        .then(function (response) {
            responseData = response.data;
            return;
        })
        .catch(function (error) {
            errMessages.push(`${error.response.status === 401 ? 'Your credential maybe not correct,':'Failed to connect the server,'} Please try agian`)
            return;
        });
    }
  
    if(errMessages.length){
      return {status: "fail",data: errMessages[0]};
    }
    
    return {status: "success",data: responseData};
}
