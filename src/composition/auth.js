import axios from "axios";

export default function auth() {
    const userData = localStorage.token ? JSON.parse(localStorage.token) : {};
    const errMessages = [];
    const redirectNonAuth = () => { 
        errMessages.push("Your aren't logged in!");
        userData.auth = 0;
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        localStorage.isAuth = "0"

        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    };
    function authUser() {
        axios.defaults.headers.common['Authorization'] = `Bearer ${userData?.token}`;
        const url = `${process.env.VUE_APP_API_URL}/api/auth/authUser`;
        axios.post(url)
            .then((res) => {
                console.log(res);
                userData.auth = 1;
            })
            .catch((err) => {
                console.log(err);
                redirectNonAuth();
                return;
            });
    }
    // authUser
    if (!userData.token) { return localStorage.setItem("isAuth", 0) };

    userData.auth = 1;
    authUser();
    if (!userData && !userData.token) {
        redirectNonAuth();
    }

    errMessages ?? localStorage.setItem("userAuthError", errMessages[0]);
    if (localStorage.getItem("isAuth")) { localStorage.isAuth = userData.auth; } else { localStorage.setItem("isAuth", userData.auth); }
    return;

}