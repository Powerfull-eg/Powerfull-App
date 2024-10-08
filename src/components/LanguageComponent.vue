<template>
    <div class="container mx-auto" id="container">
        <div class="header fs-1 fw-bold text-center"> {{ t("Select Language") }} </div>
        <div class="language-selector m-3 d-flex flex-column justify-content-evenly">
            <div @click="selectLanguage" data-lang="ar" :class="'language-container ' + (lang === 'ar' ? 'selected' :'')">
                <img class="flag img-fluid d-block" src="assets/icons/eg-flag.png" width="50" alt="">
                <div class="">العربية</div>
            </div>
            <div @click="selectLanguage" data-lang="en" :class="'language-container ' + (lang === 'en' ? 'selected' :'')">
                <img class="flag img-fluid d-block" src="assets/icons/us-flag.png" width="50" alt="">
                <div class="">English</div>
            </div>
            <div class="btn" @click="submitLanguage"> {{ lang === "en" ? "Submit" : "تأكيد" }} </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
export default {
    name: "LanguageComponent",
    setup(){
        const { t } = useI18n();
        const lang = ref(localStorage.locale);
        
        const selectLanguage = (event) => {

            document.querySelectorAll(".language-container").forEach(ele => {
                ele.classList.remove("selected")
            });
            const element = event.target.closest(".language-container");
            element.classList.add("selected");
            
            lang.value = element.getAttribute("data-lang");
            const submitBtn = document.querySelector(".language-selector > div.btn");

            localStorage?.locale && localStorage?.locale !== element.getAttribute("data-lang") ? submitBtn.style.display = "block" : submitBtn.style.display = "none";
        }

        const submitLanguage = () => {
            localStorage.setItem("locale",lang.value);
            console.log(lang.value)
            setTimeout(() => {
                window.location.href = '/';               
            }, 1000);
        }
        
        return { selectLanguage, submitLanguage, lang, t }
    }
}
</script>
<style scoped>
#container{
    background-color: var(--background);
    height: 100vh;
    position: relative;
    z-index: 1;
    margin: 30%;
}
.language-container{
    border: 1px solid;
    border-color: var(--color);
    color: var(--color);
    padding: 5%;
    font-size: 1rem;
    border-radius: 20px;
    margin: 1rem auto;
    text-align: center;
    width: 50%;
}
.language-container > img {
    margin: 0 auto;
}
.language-container.selected {
    border-color: var(--background);
    color: var(--background);
    background-color: var(--color);
}
.language-selector > div.btn {
    background-color: var(--color);
    color: var(--background);
    padding: 1.5rem;
    border-radius: 2rem;
    width: 75%;
    margin: auto;
    display: none;
} 
</style>