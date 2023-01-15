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
    <div class="home-page">
        <div class="content-homepage">
            <div class="content-product">
                <div class="title">Sản phẩm bán chạy</div>
                <div class="top-product">

                </div>
            </div>
            <div class="introduction">
            </div>
            <div class="content-product">
                <div class="title">Sản phẩm đang giảm giá mạnh</div>
                <div class="top-product">

                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.card-product {
    width: 300px;
    height: 455px;
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 3px;
}

.card-product .box-text {
    padding: 10px 10px;
    display: flex;
    gap: 1px;
    flex-direction: column;
}

.card-product:hover {
    box-shadow: 0 0 35px 0 rgb(224, 220, 220);
    background-color: white;
}

.card-product .img {
    width: 300px;
    height: 300px;
}

.card-product .category {
    text-align: center;
    font-size: 10px;
    color: rgb(152, 140, 140);
}

.card-product .product-name {
    text-align: center;
    font-size: 13px;
    height: 35px;
}

.card-product .product-price {
    font-weight: 500;
    text-align: center;
}

.card-product .box-button-add-to-cart {
    padding: 10px 10px;
    align-items: center;
    justify-content: center;
    display: flex;
}

.card-product .button-add-to-cart {
    padding: 11px 25px;
    text-transform: uppercase;
    font-size: 13px;
    cursor: pointer;
    border: solid 1px rgb(175, 172, 172);
    border-radius: 15px;
    background-color: rgb(34, 30, 30);
    color: white;
}

.content-homepage {
    height: auto
}

.content-homepage .content-product {
    padding: 50px 70px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 20px;
}

.content-homepage .content-product .title {
    text-transform: uppercase;
    font-weight: 700;
    font-size: 18px;
}

.content-homepage .content-product .top-product {
    display: flex;
    gap: 20px;
    flex-direction: row;
    flex-wrap: wrap;
}

.home-page .introduction {
    width: 100%;
    height: 400px;
    background-image: url("http://localhost:8080/images/banner.jpg");
    background-size: cover;
}

.line-through {
    text-decoration: line-through;
}
</style>