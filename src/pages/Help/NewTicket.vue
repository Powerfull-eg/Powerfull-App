<template>
    <base-layout :show-menu-button="false">
    <!-- Messages -->
    <div v-if="sent" >
        <div v-if="loader" class="loader">
            <div  class="spinner-border" role="status"></div>
            <span class="text-center d-block my-3">{{ t('Waiting ...') }}</span>
        </div>
        <div v-else class="result my-5">
            <img :src="result.img" style="display: block; margin: 0 auto" width="200" alt="">
            <span class="d-block text-center mx-3 fs-5 text">{{ result.msg }}</span>
        </div>
    </div>
    <div class="form-container" v-else  :style="lang === 'ar' ? 'direction:rtl' : 'direction:ltr' ">
        <h3 class="title"> {{ t("Send Your Message") }} </h3>
        <form @submit.prevent="submitForm" class="d-flex flex-column align-items-center justify-content-center" id="message" >

                <input type="text" :placeholder="t('Subject')" class="form-control w-75" name="subject" v-model="subject"  id="floatingInput" />
                <textarea :placeholder="t('Massege')" class="form-control w-75" name="message" v-model="message"  id="floatingTextarea2" style="height: 170px"></textarea>
            <div class="submit">
                <button type="submit">{{ t('Send') }}</button>
            </div>
        </form>
    </div>
</base-layout>
</template>

<script>
import { ref, onMounted, onUpdated } from 'vue';
import axios from "axios";
import useToast from '../../composition/useToast';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

export default {
    name:"NewTicket",
    setup(){
        const {t} = useI18n();
        const lang = localStorage?.locale
        const sent = ref(false);
        const loader = ref(false);
        const router = useRouter();
        const result = ref({});
        const { openToast } = useToast();

        // if user is not logged in
        if(localStorage.isAuth == false){
            openToast("You are not logged in please login first",'danger',"bottom");
            return router.push({name:"login"});    
        }
        else if(localStorage.connection == false){
            openToast("You are offline please reconnect and try again",'danger',"bottom");
            return router.go(-1);
        }

        function submitForm(){
            sent.value= true;
            loader.value = true;
            const form = document.querySelector("form#message");
            const formData = new FormData(form);
            
            let data = {
                subject : formData.get("subject"),
                message : formData.get("message")
            };

            axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.token).token}`;
            const url = `${process.env.VUE_APP_API_URL}/api/operations/add-ticket`;
            axios.post(url,{subject: data.subject,message: data.message})
            .then(res => {
                console.log(res);
                result.value = {
                    img : "/assets/icons/checkmark-white.png",
                    success : true,
                    msg : "Your inquiry has been sent successfully \n You ticket number is: " + res.data.ticket_id 
                }
                loader.value = false;
                setTimeout(() => { 
                    sent.value = false;
                    router.push({name:"Tickets"}) 
                }, 3000);

            })
            .catch(err => {
                console.log(err)
                result.value = {
                    img : "/assets/icons/fail-white.png",
                    success : false,
                    msg : "Something went wrong \n Please try again" 
                }
                loader.value = false;
                setTimeout(() => { sent.value = false; }, 3000);
            })
        }

        onUpdated(()=>{
            sent.value= false;
            loader.value = false;
        });
        return { submitForm, sent, loader, result, t, lang }
    }
}
</script>

<style scoped>
div.form-container {
    width: 100%;
    margin: 7em 0;
}

input.form-control{
    margin: 10px ;
}
div.submit > button{
    background-color: var(--main-color-light);
    color: #fff;
    border: 1px solid var(--color);
    padding: 10px 50px;
    border-radius: 30px;
    box-shadow: var(--main-color-light) 1px 4px 15px;
    margin: 2rem auto;
    display: block;
}
h3.title {
    font-size: 20px;
    font-weight: 500;
    text-align: center;
    margin-bottom: 2rem;
}

.loader {
    text-align: center;
    margin: 10rem auto;
    color: #f68d41;
}
</style>