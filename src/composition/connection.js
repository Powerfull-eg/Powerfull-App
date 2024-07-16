import axios from "axios";


async function checkConnection() {
    let connection;

    const url = process.env.VUE_APP_API_URL + "/api/connection";
    
    await axios.get(url)
    .then(res => connection = res.status == 200 ? 1 : 0)
    .catch(err => connection = 0);    

    if(localStorage.getItem("connection")){ localStorage.connection = connection; } else { localStorage.setItem("connection",connection); }
}

checkConnection();