<template>
    <div class="login-button google">
        <div id="g_id_onload"
            data-client_id="52799626204-vpc69egmpenm7vummcbbsj1ifsacnk5v.apps.googleusercontent.com"
            data-context="use"
            data-ux_mode="popup"
            data-callback="googleLogin"
            data-nonce=""
            data-itp_support="true">
        </div>
        <div class="g_id_signin"
            data-type="icon"
            data-shape="circle"
            data-theme="outline"
            data-text="continue_with"
            data-size="large">
        </div>
    </div>

    <!-- Modal -->
    <div class="offcanvas offcanvas-bottom" tabindex="-1" id="offcanvasGoogle" aria-labelledby="offcanvasBottomLabel">
        <div class="offcanvas-header fs-3">
            <h5 class="offcanvas-title" id="offcanvasBottomLabel">{{ modalData.header }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body small">
            <div v-if="modalData.loader" style="color:#f68d41" class="spinner-border text-center" role="status"></div>
            <span v-if="modalData.loader" style="color:#f68d41" class="text-center d-block my-3">Loading...</span>
            <div v-else>
            <img :src="modalData.body.img" alt=""  width='50' class='d-block mx-auto mb-3'>
            <span class='d-block mx-auto fs-4 text-center text' :class="'text-'+ modalData.body.textStyle">{{ modalData.body.text }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { ref,onMounted } from 'vue';
import axios from 'axios';
import * as bootstrap from 'bootstrap';
import { useRouter } from 'vue-router';

export default {
    name:"GoogleLogin",

    setup(){
        const modalData = ref({header : '', body: {}});
        const router = useRouter();
        const online = localStorage.connection == true;
        let offcanvas;

        function showCanvas(success,text){
            offcanvas.hide();
            modalData.value = {
                loader : true,
                header : "In Progress ... ",
                body : {
                    img : "/assets/icons/wait.png",
                    text : "Operation In progress...",
                    textStyle : "secondary",
                }

            }
            offcanvas.show();
            setTimeout( () =>{       
                modalData.value = {
                    loader : false,
                    header : success ? "Login Success" : "Login Failed",
                    body : {
                        img : success ? "/assets/icons/success.png" : "/assets/icons/fail.png",
                        text : text,
                        textStyle : success ? "success" : "danger",
                    }
                }         
                
                setTimeout( () =>{ offcanvas.hide(); },5000);
            },2000);
        }

            // Check Internet 
        if(!online) {
            offcanvas.hide();
            showCanvas(false,`No Intenet ,You are not online \n Please connect to newtwork and try again later`);
            setTimeout( () =>{ offcanvas.hide();},5000);
        }

        onMounted(()=>{
            offcanvas = new bootstrap.Offcanvas(document.querySelector('#offcanvasGoogle'));

            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            document.head.appendChild(script);
        })

        window.googleLogin = (response)=>{
            const url = `${process.env.VUE_APP_API_URL}/api/google-login`;
            axios.post(url,{token:response.credential})
            .then(
                (res) => { 
                    if(res.status === 200){
                        // Storing token
                        localStorage.setItem("token",JSON.stringify(
                        {
                            token : res.data.token.access_token,
                            tokenType : res.data.token.token_type,
                        }
                        ));
                        // Storing User Data
                        localStorage.setItem("userData",JSON.stringify(
                        {
                            'id' : res.data.user.id, 
                            'first_name' : res.data.user.first_name, 
                            'last_name' : res.data.user.last_name, 
                            'email' : res.data.user.email, 
                            'phone' : res.data.user.phone,
                            'photo' : res.data.user.photo,
                            'cards' : res.data.user.cards,
                        }
                        ));
                        showCanvas(true,"Login succeseeded We will redirect you to home page");
                        setTimeout(() => { window.location.href = '/';},3000)
                    }
                }
            )
            .catch((err) => {console.log(err); showCanvas(false,`Something went wrong: ${error},\n Please try again`);})
        }
        
        return { googleLogin,modalData }
    }
}
</script>

<style scoped>
/* Modal */
#offcanvasGoogle{
  --bs-offcanvas-height: 55%;
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
    border-top: 5px solid #f68d41;
    padding: 0 10px;
}
.offcanvas-header{
  padding: 20px 20px 0 0;
}
.offcanvas-body{
  padding: 0;
  padding-top: 30px;
}
.google {
      background-color: #db4a39;
      color: white;
}

.login-button {
      display: inline-block;
      padding: 8px;
      border-radius: 50px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      cursor: pointer;
      margin: 22px;
}
</style>