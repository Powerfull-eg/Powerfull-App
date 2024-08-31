<template>
    <div class="rating-navs fw-bold">
        <div class="body-middle d-flex justify-content-between w-75 mx-auto px-3 pt-3">
            <!-- react button -->
            <div class="react-btn d-flex">
                <img src="assets/icons/like.png" alt="react icon">
                <span>إضافة تفاعل</span>
            </div>
            <!-- comment button -->
            <div @click.prevent="addComment()" class="comment-btn d-flex">
                <img src="assets/icons/comment.png" alt="comment icon">
                <span>إضافة تعليق</span>
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
                <img src="assets/images/logo.png" style="width:20px">
                <span>{{rate.rate}}</span>
            </div>
        </div>
        <div class="comment-text">
            <span class="d-block text-center fs-6">{{rate.comment ?? 'لا يوجد تعليق' }}</span>
    </div>
    </div>
        <div class="text-center comment p-3" v-else>
            <span>لا يوجد تعليقات أو تقييمات</span>
        </div>
    </div>

<!-- Modals -->
    <!-- Comment Modal -->
    <div class="modal" id="comment-modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header text-right">
                <h5 class="modal-title">إضافة تعليق</h5>
                <!-- <h5 class="modal-title">إضافة تعليق</h5> -->
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form method="post">
                    <!-- Ratings -->
                    <div class="mb-3">
                        <div class=" d-flex justify-content-center mt-5">
                            <div class=" text-center mb-5">
                                <div class="rating"> <input type="radio" name="rating" value="5"><label for="5">☆</label> <input type="radio" name="rating" value="4"><label for="4">☆</label> <input type="radio" name="rating" value="3"><label for="3">☆</label> <input type="radio" name="rating" value="2"><label for="2">☆</label> <input type="radio" name="rating" value="1"><label for="1">☆</label> </div>
                                <div class="buttons  mt-0"> <button class="btn btn-info px-4 py-1 rating-submit ">Submit</button> </div>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="exampleFormControlTextarea1" class="form-label">Example textarea</label>
                        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
            </div>
            </div>
        </div>
    </div>
    <!-- React Modal -->
    <div class="modal" id="react-modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Modal title</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>Modal body text goes here.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
            </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref } from 'vue';
import * as bootstrap from 'bootstrap';
export default {
    name: "Rates",
    props: ['data'],
    setup(props) {
        const addComment = () => {
            const modal = new bootstrap.Modal('#comment-modal', {
                keyboard: false,
                backdrop: false
            });
            
            modal.toggle();
        }
        // Submit comment request
        const submitComment() => {
            
        }

        return {
            addComment,
            submitComment
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
/*  */
</style>