<template>
    <base-layout page-default-back-link="/profile" :show-menu-button="false" loading="lazy" >
        <div class="coming-soon">
            <img src="/assets/images/coming-soon.png" alt="Coming Soon">
        </div>
    </base-layout>
    </template>
    
    <script>
    
    export default {
        name: "Account",
        components: {},
        setup(){
            
        }
    }
    </script>
    
    <style scoped>
    div.coming-soon {
        height: 100%;
        overflow: hidden;
        background: #fbb613;
        position: relative;
    }
    div.coming-soon img{
        position: absolute;
        top: 30%;
        bottom: 0;
        background-color: transparent;
    }
    </style>