<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        
    },
    computed: {

    },
    mounted() {
        
    }
}
</script>
<template>
<footer>
    <div class="top-footer">
        <div class="card-footer">
            <span class="title-footer">GIỚI THIỆU</span>
            <div class="content-footer">
                Chào mừng bạn đến với ABC Sneaker! Tại đây, bạn sẽ tìm được đôi giày phù hợp với bản thân mình
            </div>
        </div>
        <div class="card-footer">
            <span class="title-footer">Liên hệ</span>
            <div class="content-footer">
                <div class="content-footer-item address">
                    <div class="footer-icon-address"></div>
                    <div></div>
                </div>
                <div class="content-footer-item">
                    <div></div>
                    <div>0961234578</div>
                </div>
                <div class="content-footer-item">
                    <div></div>
                    <div>abc@gmail.com</div>
                </div>
            </div>
        </div>
        <div class="card-footer">
            <span class="title-footer">Về ABC</span>
            <div class="content-footer-item">
                <div></div>
                <div>Trợ giúp</div>
            </div>
        </div>
        <div class="card-footer">
            <span class="title-footer">Mạng xã hội</span>
            <div class="content-footer-item">
                <div class="icon-social"></div>
                <div class="icon-social"></div>
                <div class="icon-social"></div>
                <div class="icon-social"></div>
            </div>
        </div>
    </div>
    <div class="bot-footer">
        © Copyright: Huynh Thanh Xuan
    </div>
</footer>
</template>
<style scoped>
footer {
    min-height: 200px;
    position: relative;
}

.top-footer {
    background: rgb(41, 38, 38);
    color: rgb(253, 244, 244);
    padding: 50px 150px;
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
    justify-content: center;
}

.bot-footer {
    text-align: center;
    font-weight: 500;
    width: 100%;
    background: rgb(21, 19, 19);
    color: rgb(253, 244, 244);
    padding-top: 10px;
    padding-bottom: 10px;
}

.card-footer {
    display: flex;
    flex-direction: column;
    flex-basis: 270px;
    gap: 15px;
}

.card-footer .title-footer {
    display: block;
    font-size: 18px;
    font-weight: 600;
    border-bottom: solid 1px red;
    width: fit-content;
    text-transform: uppercase;
}

.card-footer .content-footer {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.content-footer-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}

.content-footer-item div {
    display: flex;
    align-items: center;
}

.content-footer-item .footer-icon-address {
    align-self: flex-start;
    margin-top: 3px;
}

.icon-social {
    font-size: 18px;
}
</style>
