<template>
<base-layout :pageTitle="t('FAQ')" :show-menu-button="false" loading="lazy">
<div class="page-container">
    <!-- Question -->
    <a class="question-container" v-for="qa in QAs" :key="qa.id" data-bs-toggle="collapse" :href="'#answerCollapse'+qa.id" role="button" aria-expanded="false" :aria-controls="'answerCollapse'+qa.id">
    <div class="faq-link d-flex">
        <div class="image-container"><img src="/assets/icons/alert.png" width="50" alt=""></div>
        <span class="question">{{qa.question}}</span>
        <ion-icon style="vertical-align: middle;" :icon="Icons.chevronForwardOutline"></ion-icon>
    </div>
    <!-- Answer -->
    <div :id="'answerCollapse'+qa.id" class="collapse"> {{qa.answer}} </div>
    </a>

</div>
</base-layout>
</template>
<script>
import { ref } from 'vue';
import { caretUpOutline, caretDownOutline, chevronForwardOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';
import { useI18n } from 'vue-i18n';
export default {
  name: 'Faqs',
  components: {
    IonIcon,
  },
  setup() {
    const {t} = useI18n();
    const faqOpen = ref(false);
    const QAs = [
      {
        id: 1,
        question: 'What do I do if the charger is not received even after payment confirmation?',
        answer: `If a power bank does not properly eject from the station, please send us feedback by following these easy steps:
                    1.Open Powerfull app 
                    2.Go to Menu > Help Center > Feedback
                    3.Scan station QR code, or enter station ID
                    4.Select feedback type from the list
                    5.Enter a valid phone number or email
                    6.Type a short description of the issue 
                    7.Upload a photo of the power bank station
                    8.Submit your feedback 

                    The support team will then contact you ASAP.
                    `,
      },
      {
        id: 2,
        question: 'Who do I contact for support?',
        answer: `The customer service team may be reached through one of the following channels:
                    * Email: support@powerfull-eg.com
                    * Phone: +201004554635
                    * Whats App: +201004554635`,
      },
      // {
      //   id: 3,
      //   question: 'How much does a power bank cost?',
      //   answer: `Powerfull offers its power banks for rent and NOT for sale as per the following terms:
      //               * The first 10 minute charge is for free (once a day)
      //               * After the first 10 minutes, an additional charge 20 EGP (every 24 hours)
      //               * A total of 1200 EGP VAT included will be charged to users after 48 hours (three days rent fee + power bank cost).
      //               * It is expected from users to return the units within the first 24 hours to enable more users to enjoy the service. 
      //               * Powerfull reserves all rights to keep or change its service terms. `,
      // },
      {
        id: 4,
        question: 'Which debit or credit cards are accepted at Powerfull?',
        answer: `Powerfull accepts the following payment methods: 
                    * Visa Card 
                    * Mezza Card 
                    * Mastercard Card 
                    * Vouchers`,
      },
      {
        id: 5,
        question: 'When will my debit or credit card be charged?',
        answer: 'After you return the charger, the amount will be deducted from your e-wallet or credit card. based on your rental duration.',
      },
      {
        id: 6,
        question: 'Which devices can be charged using the power bank units?',
        answer: `There are three (3) different charging cables included in the power bank unit: 
                    * Micro-USB cable; compatible with some phones & handhelds
                    * Type-C cable; compatible with most of current mobiles & handhelds
                    * Lighting cable; compatible with current Apple mobiles`,
      },
      {
        id: 7,
        question: 'How do I recharge a power bank unit?',
        answer: '* Any standard Micro-USB charging cable can be used to recharge the power bank unit.',
      },
      {
        id: 8,
        question: 'How long can I keep the power bank unit?',
        answer: '* A rented charger can be kept for up to 3 days (72 hours). After that, the unit is considered lost. The rental duration will be effective immediately after the first 15 minutes elapse.',
      },
      {
        id: 9,
        question: 'Where do I return the power bank unit?',
        answer: '*You can return the charger to any of our Powerfull station around Egypt. You can locate the nearest station via Powerfull mobile app. ',
      },
    ];
    const Icons = { caretUpOutline, caretDownOutline, chevronForwardOutline };

    return { Icons, faqOpen, QAs, t };
  },
};
</script>

<style scoped>
.page-container {
    width: 75%;
    margin: 0 auto;
    text-align: center;
}
a.question-container{
  text-decoration: none;
  color: inherit;
  transition: ease-in-out .2s;
}
a[aria-expanded="true"] ion-icon {
    transform: rotate(90deg);
    transition: ease-in-out .2s;
}
.faq-link {
    text-align: center;
    border: 2px solid var(--color);
    padding: 1rem;
    margin: 2rem auto;
    border-radius: 30px;
    width: 100%;
    display: block;
    color: unset;
    text-decoration: unset;
    font-size: 1.2rem;
    font-weight: 500;
    justify-content: space-between;
}
.image-container {
    width: 20%;
    background: #f3f3f3;
    padding: 10px;
    border-radius: 15px;
}

span.question {
    width: 70%;
    font-size: 70%;
    align-self: center;
}
.faq-link > ion-icon {
    font-size: 20px;
    align-self: center;
}
</style>
