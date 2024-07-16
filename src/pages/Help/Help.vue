<template>
<base-layout page-default-back-link="/home" :pageTitle="t('Support')" :show-menu-button="false" loading="lazy" >
<div class="d-flex flex-column w-100 justify-content-center align-items-center h-100">
    <router-link class="help-link" to="/Faqs">{{t('FAQ')}} <ion-icon style="vertical-align: middle;color:var(--background)" :icon="Icons.chevronForwardOutline"></ion-icon></router-link>
    <router-link class="help-link" to="/tickets">{{t('Your Tickets')}} <ion-icon style="vertical-align: middle;color:var(--background)" :icon="Icons.chevronForwardOutline"></ion-icon></router-link>
    <router-link to="/tickets/new" class="help-link">{{t('Send New Ticket')}} <ion-icon style="vertical-align: middle; color:var(--background)" :icon="Icons.chevronForwardOutline"></ion-icon></router-link>

</div>
    </base-layout>
</template>

<script>
import {caretUpOutline,caretDownOutline,chevronForwardOutline} from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
export default {
    name: "Help",
    components: {
        IonIcon
    },
    setup(){
        const {t} = useI18n();
        const Icons = { caretUpOutline, caretDownOutline, chevronForwardOutline, t };

        return { Icons, t };
    }
}
</script>

<style scoped>
.help-link {
    text-align: center;
    border: 2px solid var(--color);
    padding: 1rem;
    border-radius: 30px;
    width: 75%;
    display: block;
    color: #000;
    background-color: white;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: 500;
    margin: 2rem 0;
}

.newRequest{
    text-align: center;
    border: 2px solid var(--color);
    padding: 1rem;
    margin: 2rem auto;
    border-radius: 20px;
    width: 75%;
    display: block;
    color: unset;
    text-decoration: unset;
    font-size: 1.2rem;
    font-weight: 500;
}
.new-request-container {
    bottom: 0;
  position: fixed;
  width: 100%;
  padding: 2.5rem 0;
  background-color: var(--background);
  border-top-left-radius: 2rem;
  border-top-right-radius: 2rem;
  border-top: 5px solid var(--color);
}
a.question {
    text-decoration: unset;
    color: unset;
    padding: 20px 0 20px 20px;
    font-size: 18px;
    font-weight: 500;
    width: 95%;
    display: block;
    background-color: #d2e2e9;
    border-radius: 18px;
}
.question-container {
    margin: 1rem 0;
}
.question-container > p {
    display: block;
    border-radius: 18px;
    margin-bottom: 0;
}

div.answer-container {
    width: 100%;
    font-weight: 500;
}
div.answer {
    width: 90%;
    margin: 10px auto;
}

a.tickets-link {
    text-decoration: unset;
    color: #f68d41;
    font-size: 20px;
    font-weight: 600;
    padding-left: 10px;
}
ion-icon {
    float: inline-end;
    margin-right: 20px;
    font-size: 25px;
}
.newPayment{
    width: 20px;
    height: 20px;
    text-align: center;
    border-radius: 50%;
      background: #fff;
      color: #f27920;
      padding: 25px;
      margin: 10px;
  }
  .new-payment-container {
    bottom: 0;
    position: fixed;
    width: 100%;
    padding: 2.5rem 0;
    background-color: var(--background);
    /* border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
    border-top: 5px solid var(--color); */
  }
</style>