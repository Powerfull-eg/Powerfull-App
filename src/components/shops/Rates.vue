<template>
    <div class="rating-navs fw-bold">
        <div class="body-middle d-flex justify-content-between w-75 mx-auto px-3 pt-3">
            <!-- react button -->
            <div @click.prevent="addCommentOrReact('react')" class="react-btn d-flex">
                <img src="assets/icons/like.png" alt="react icon">
                <span>{{t('shop.add-react')}}</span>
            </div>
            <!-- comment button -->
            <div @click.prevent="addCommentOrReact()" class="comment-btn d-flex">
                <img src="assets/icons/comment.png" alt="comment icon">
                <span>{{t('shop.add-comment')}}</span>
            </div>
        </div>
    </div>
    <div class="comments d-flex flex-column justify-content-center" style="overflow: scroll">
        <div class="comment px-3" v-if="data?.rates?.length > 0" v-for="rate in data?.rates" :key="rate.id">
            <hr>
        <div class="d-flex justify-content-between">
            <div class="user-name pb-3">
                <img src="assets/icons/avatar.png" style="width:20px">
                <span>{{rate.user_name}}</span>
            </div>
            <div class="user-rate">
                <div class="reaction d-inline-block px-3" v-if="data?.reactions?.length > 0" v-for="reaction in data?.reactions" :key="reaction.user_id">
                    <span v-if="reaction.user_id == rate.user_id">{{ getReactionEmojie(reaction.reaction) }}</span>
                </div>
                <img src="assets/icons/star.png" style="width:20px">
                <span>{{rate.rate}}</span>
            </div>
        </div>
        <div class="comment-text">
            <span class="d-block text-center fs-6">{{rate.comment ?? t('shop.no-comment') }}</span>
    </div>
    </div>
        <div class="text-center comment p-3" v-else>
            <span>{{ t('shop.no-comments-rates')  }}</span>
        </div>
    </div>

<!-- Modals -->
    <!-- Comment Modal -->
    <div class="modal fade" id="comment-modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header text-right">
                <h5 class="modal-title">{{t('shop.add-comment')}}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form method="post" @submit.prevent="submitCommentOrReact('comment',$event)">
            <div class="modal-body">
                    <!-- Ratings -->
                    <div class="mb-3">
                        <div class=" d-flex justify-content-center mt-2">
                            <div class="text-center">
                                <span>{{t('shop.rate')}}</span>
                                <div class="rating"> <input type="radio" name="rating" id="rating-5" value="5"><label for="rating-5">☆</label> <input type="radio" name="rating" id="rating-4" value="4"><label for="rating-4">☆</label> <input type="radio" name="rating" id="rating-3" value="3"><label for="rating-3">☆</label> <input type="radio" name="rating" id="rating-2" value="2"><label for="rating-2">☆</label> <input type="radio" name="rating" id="rating-1" value="1"><label for="rating-1">☆</label> </div>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="exampleFormControlTextarea1" class="form-label">{{t('shop.comment')}}</label>
                        <textarea class="form-control" maxlength="200" name="comment" id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="mt-0"> 
                        <button type="submit" class="btn px-4 mx-3 py-1 rating-submit" style="background-color: var(--background);">{{t('Confirm')}}</button> 
                        <button type="button" class="btn" data-bs-dismiss="modal">{{t('Cancel')}}</button>
                    </div>
                </div>
            </form>
            </div>
        </div>
    </div>
    <!-- React Modal -->
    <div class="modal fade" id="react-modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header text-right">
                <h5 class="modal-title">{{t('shop.add-react')}}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form method="post" @submit.prevent="submitCommentOrReact('reaction',$event)">
            <div class="modal-body">
                    <!-- Ratings -->
                    <div class="mb-3">
                        <div class=" d-flex justify-content-center mt-2">
                            <div class="text-center">
                                <!-- 'like', 'dislike','love','angry','sad','surprised' -->
                                <div class="reaction-container">
                                    <input type="radio" id="reaction-like" :checked="checkedReact === 'like' ? 'checked': 'false'" name="reaction" value="like" class="reaction-input">
                                    <label for="reaction-like" class="reaction-label"> &#x1F44D;</label>

                                    <input type="radio" id="reaction-love" :checked="checkedReact === 'love' ? 'checked': 'false'" name="reaction" value="love" class="reaction-input">
                                    <label for="reaction-love" class="reaction-label"> &#x1F60D; </label>

                                    <input type="radio" id="reaction-dislike" :checked="checkedReact === 'dislike' ? 'checked': 'false'" name="reaction" value="dislike" class="reaction-input">
                                    <label for="reaction-dislike" class="reaction-label"> &#x1F44E;</label>


                                    <input type="radio" id="reaction-surprised" :checked="checkedReact === 'surprised' ? 'checked': 'false'" name="reaction" value="surprised" class="reaction-input">
                                    <label for="reaction-surprised" class="reaction-label"> &#x1F632;</label>


                                    <input type="radio" id="reaction-sad" :checked="checkedReact === 'sad' ? 'checked': 'false'" name="reaction" value="sad" class="reaction-input">
                                    <label for="reaction-sad" class="reaction-label"> &#x1F61E;</label>


                                    <input type="radio" id="reaction-angry" :checked="checkedReact === 'angry' ? 'checked': 'false'" name="reaction" value="angry" class="reaction-input">
                                    <label for="reaction-angry" class="reaction-label"> &#x1F621;</label>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="mt-0"> 
                        <button class="btn px-4 mx-3 py-1 rating-submit" style="background-color: var(--background);">{{t('Confirm')}}</button> 
                        <button type="button" class="btn" data-bs-dismiss="modal">{{t('Cancel')}}</button>
                    </div>
                </div>
            </form>
            </div>
        </div>
    </div>
</template>
<script>
import { ref } from 'vue';
import * as bootstrap from 'bootstrap';
import useToast from './../../composition/useToast';
import axios from 'axios';
import { onUpdated } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
    name: "Rates",
    props: ['data'],
    setup(props) {
        const { t } = useI18n({});
        const { openToast } = useToast();
        const commentOrReactModal = ref(null);
        const checkedReact = ref('');
        onUpdated(() => {
            if (props?.data?.reactions && props?.data?.reactions?.length > 0 ) {
                if(localStorage?.userData){
                    props.data.reactions.forEach(reaction => {
                        if(reaction.user_id === JSON.parse(localStorage.userData).id){
                            checkedReact.value = reaction.reaction;
                            console.log(checkedReact.value);
                            return;
                        }
                    })
                }
            }
        })
        const addCommentOrReact = (target = 'comment') => {
            // Add comment
            if (target === 'comment' && props?.data?.rates && props?.data?.rates?.length > 0 ) {
                // Check if user is logged in
                if(localStorage?.userData){
                    // Check if user already rated
                    let rateAdded = false;
                    props.data.rates.forEach(rate => {
                        console.log(rate);
                        if(rate.user_id === JSON.parse(localStorage.userData).id){
                            rateAdded = true;
                            return;
                        }
                    });
                    // If user already rated
                    if(rateAdded){
                        openToast(`تم تقييم هذا المكان من قبل`,'danger','bottom');
                        return;
                    }
                // If user is not logged in
                }else{
                    openToast('يجب عليك تسجيل الدخول','danger','bottom');
                    return;
                }
            }

            commentOrReactModal.value = new bootstrap.Modal(target === 'comment' ? '#comment-modal' : '#react-modal', {
                keyboard: false,
                backdrop: false
            });
            commentOrReactModal.value.toggle();
        }
        // Submit comment request
        const submitCommentOrReact = (target,event) => {
            const formData = new FormData(event.target);
            let data = {};
            data.shop_id = props.data.id;
            
            // get all data
            if(target === 'comment'){
                data.comment = formData.get('comment');
                data.rate = formData.get('rating');
            }else{
                data.reaction = formData.get('reaction');
                console.log("197 "+data.reaction);
                checkedReact.value = data.reaction;
            }

            // Send request
            let url = target === 'comment' ? 'add-comment' : 'add-react';
            url = `${process.env.VUE_APP_API_URL}/api/operations/shops/${url}`;
            axios.post(url,data)
            .then((res) => {
                if(target === 'comment'){
                    props.data.rates = res.data;
                    openToast('تم إضافة التقييم','success','bottom');
                }else{
                    props.data.reactions = res.data;
                    openToast('تم إضافة التفاعل','success','bottom');
                }
        
            commentOrReactModal.value ? commentOrReactModal.value.hide() : '';
            })
            .catch((err) => {
                openToast('حدث خطأ ما','danger','bottom');
            });
        }

        const getReactionEmojie = (reaction) => {
            const parent = document.querySelector(".reaction-container");
            const reactionText = parent.querySelector("label[for=reaction-" + reaction + "]");
            return reactionText.textContent;
        }
        return {
            addCommentOrReact,
            submitCommentOrReact,
            checkedReact,
            getReactionEmojie,
            t
        }
    }
}
</script>

<style scoped>
* {
    font-weight: bold;
      font-size: .7rem;
}
img
    {
      width: 1.3rem;
      height: 1.3rem;
      padding-right: 5px;
    }

/* Rating start css */
.rate {
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px
}

.rating {
    display: flex;
    flex-direction: row-reverse;
    justify-content: center
}

.rating>input {
    display: none
}

.rating>label {
    position: relative;
    width: 1em;
    font-size: 30px;
    font-weight: 300;
    color: #FFD600;
    cursor: pointer
}

.rating>label::before {
    content: "\2605";
    position: absolute;
    opacity: 0
}

.rating>label:hover:before,
.rating>label:hover~label:before {
    opacity: 1 !important
}

.rating>input:checked~label:before {
    opacity: 1
}

.rating:hover>input:checked~label:before {
    opacity: 0.4
}

.buttons {
    top: 36px;
    position: relative
}

.rating-submit {
    border-radius: 8px;
    color: #fff;
    height: auto
}

.rating-submit:hover {
    color: #fff
}
/* Modal */
.modal{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1050;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    outline: 0
}
/* Reactions */
    /* Container */
    .reaction-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 50px;
    }

    /* Hide radio buttons */
    .reaction-input {
      display: none;
    }

    /* Labels as buttons */
    .reaction-label {
      font-size: 1.5rem;     
      padding: 0px;
      margin: 0 10px;
      cursor: pointer;
      transition: transform 0.2s, color 0.2s;
    }

    /* Hover effects */
    .reaction-label:hover {
      transform: scale(1.3);
    }

    /* Active state */
    .reaction-input:checked + .reaction-label {
      color: #007bff;
      transform: scale(1.5);
    }
    * {
      font-family: "abdo-master";
    }
</style>