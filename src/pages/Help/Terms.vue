<template>
  <base-layout :pageTitle="content.header" :show-menu-button="false" loading="lazy">
      <div class="page-container">
          <!-- <h1 class="d-block text-center main-title fw-bold">{{t('settings.Terms and Conditions')}}</h1> -->
          <div class="content" :style="locale == 'ar' ? 'direction:rtl': 'direction:ltr'">
              <div class="part">
                  <!-- <h4 class="title d-inline-block">{{ content.header }}</h4> -->
                  <ul><li class="content" :style="locale == 'ar' ? 'direction:rtl': 'direction:ltr'">
                    {{ content.subheader }}
                  </li></ul>
              </div>
              <div class="part" v-for="section in content.sections" :key="section.title" :style="locale == 'ar' ? 'direction:rtl': 'direction:ltr'">
                  <h4 class="title d-inline-block">{{ section.title }}</h4>
                  <ul><li class="content">
                    {{ section.content }}
                  </li></ul>
              </div>
          </div>
      </div>
  </base-layout>    
  </template>

<script>
import { onMounted } from "vue";
import allContents from "./../../contents/termsconditions"
import { useI18n } from "vue-i18n";
export default {
name: "Terms",
components: {
  },
  setup(){
        const { t } = useI18n();
        const content = localStorage.locale == "ar" ? allContents.ar : allContents.en
        const locale = localStorage.locale;
        return{ t, content, locale}
    }
}
</script>
<style scoped>
.page-container {
    margin: 3rem auto 11rem auto;
    text-align: center;
}
h1.main-title {
    margin: 30px;
    color: var(--color);
}
.content {
    width: 95%;
    text-align: justify;
    margin: 0 auto;
    direction: rtl;
}
li.content {
    font-weight: 700;
    font-size: 13px;
    list-style: square;
}
h4.title {
    color: var(--color);
    font-weight: 700;
    text-decoration: underline;
    font-size: 16px;
}
</style>
