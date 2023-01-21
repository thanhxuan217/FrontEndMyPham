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
    <div class="banner">

    </div>
</template>
<style scoped>
.banner {
    height: 700px;
    /* margin: 2% 10%; */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: azure;
    position: relative;
    background-image: url(http://localhost:8080/api/product/getImage/banner1.jpg);
    background-size: cover;
}
</style>
