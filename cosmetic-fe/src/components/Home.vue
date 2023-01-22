<script>
import Banner from './Banner.vue';
import Card from './Card.vue';
import ProductAPI from '../api/ProductAPI/ProductAPI';
export default {
    data() {
        return {
            poplularProducts: []
        }
    },
    methods: {},
    computed: {},
    mounted() {
        // call API
        const fetchData = async () => {
            await ProductAPI.getPopularProducts()
                .then(res => {
                    console.log(res.data)
                    this.poplularProducts = res.data
                })
        }
        fetchData()
    },
    components: { Banner, Card }
}
</script>
<template>
    <div class="home-page">
        <div class="content-homepage">
            <Banner />
            <div class="content-product">
                <div class="title">Sản phẩm bán chạy</div>
                <div class="top-product">
                    <Card v-for="cartitem in poplularProducts" 
                        :key="cartitem.COSMETIC.COSMETIC_ID"
                        :cosmetic= "cartitem.COSMETIC"
                        :images ="cartitem.images"
                    />
                </div>
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