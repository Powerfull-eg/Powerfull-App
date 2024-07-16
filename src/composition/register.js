export default async function register(data) {
  const errMessages = [];
  let responseData;
  const requiredValues = ['fname', 'lname', 'email', 'phone', 'password', 'confirm'];
  const axios = require('axios');
  let apiUrl;

  // Check Internet
  if (!navigator.onLine) {
    errMessages.push('You should be online to complete registeration.');
  }

  // Validate data
  // check if required data is exist
  requiredValues.map((value) => {
    if (data[value] === 'undefined' || data[value] === 'null') {
      errMessages.push(`${value} shouldn't be empty`);
    }
  });

  // validate email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(data.email)) {
    errMessages.push('The intered Email isn\'t correct');
    console.log(errMessages);
  }

  // Validate password
  const passwordPattern = /^.{8,}$/;
  if (!passwordPattern.test(data.password)) {
    errMessages.push('The Minimum length of password should be 8 characters');
  }

  if (data.password !== data.confirm) {
    errMessages.push('the password and confirm password not identical');
  }

  // Validate phone
  const phonepattern = /^(10|11|12|15)\d{8}$/;
  if (!phonepattern.test(data.phone)) {
    errMessages.push('the phone number isn\'t a valid number');
  }

  // check if mail or phone not exist
  if (!errMessages.length) {
    // Check Email
    apiUrl = `${process.env.VUE_APP_API_URL}/api/checkemail`;
    await axios.post(apiUrl, { email: data.email })
      .then((response) => {
        if (response.data === 1) {
          errMessages.push('Email address is already exist');
        }
      })
      .catch((error) => {
        errMessages.push('Failed to connect the server, Please try agian');
      });

    // Check Phone
    apiUrl = `${process.env.VUE_APP_API_URL}/api/checkphone`;
    await axios.post(apiUrl, { phone: data.phone })
      .then((response) => {
        if (response.data === 1) {
          errMessages.push('Phone number is already exist');
        }
      })
      .catch((error) => {
        errMessages.push('Failed to connect the server, Please try agian');
      });

    // stoping from sending register request
    if (errMessages.length) {
      return { status: 'fail', data: errMessages[0] };
    }

    // If no errors -- send request

    apiUrl = `${process.env.VUE_APP_API_URL}/api/register`;
    await axios.post(apiUrl, data)
      .then((response) => {
        responseData = response.data.original;
      })
      .catch((error) => {
        errMessages.push('Failed to connect the server, Please try agian');
      });
  }

  if (errMessages.length) {
    return { status: 'fail', data: errMessages[0] };
  }
  console.log(responseData);
  return { status: 'success', data: responseData };
}
