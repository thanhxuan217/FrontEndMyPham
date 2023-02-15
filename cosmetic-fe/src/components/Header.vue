<script>
import { useUserStore } from '../store/userStore'
import { useCartStore } from '../store/cartStore'
import { mapState, mapActions } from 'pinia'
import AuthenticationAPI from '../api/LoginAPI/authenticationAPI';
import ProductAPI from '../api/ProductAPI/ProductAPI'
import { RouterLink } from 'vue-router'
import CartAPI from '../api/CartAPI/CartAPI';
export default {
    data() {
        return {
            isShowBotHeader: false,
            isShowTopHeader: false,
            categories: [],
            isShowCategoriesDropdownMenu: false,
            isShowDiscountsDropdownMenu: false,
            keyword: null
        }
    },
    methods: {
        // khai bao action su dung => su dung nhu this => use như function
        ...mapActions(useUserStore, ["commitUserInfo"]),
        ...mapActions(useCartStore, ['commitCartQuantity']),
        handleScrollHeader() {
            if (window.scrollY >= 130 && window.innerWidth > 886) {
                this.isShowBotHeader = true
            }
            else {
                this.isShowBotHeader = false
            }
            if (window.scrollY >= 64 && window.innerWidth <= 886) {
                this.isShowTopHeader = true
            }
            else {
                this.isShowTopHeader = false
            }
        },
        goToProductPage(e) {
            const id = e.currentTarget.id.split(' ')
            let discountId = null
            let filter = {
                categoryIds: [],
                categoryDetailIds: [],
                price: [0, 2000000]
            }
            switch (id[0]) {
                case 'category':
                    filter = {
                        categoryIds: [id[1]],
                        categoryDetailIds: [],
                        price: [0, 2000000]
                    }
                    break
                case 'categoryDetail':
                    filter = {
                        categoryIds: [],
                        categoryDetailIds: [id[1]],
                        price: [0, 2000000]
                    }
                    break
                case 'product':
                    filter = {
                        categoryIds: [],
                        categoryDetailIds: [],
                        price: [0, 2000000]
                    }
                    break
                default:
                    discountId = id[1]
                    break
            }
            if (discountId) {
                this.$router.push({ name: 'products', query: { discountId: discountId }, replace: true })
            } else {
                this.$router.push({ name: 'products', query: { categoryIds: filter.categoryIds, categoryDetailIds: filter.categoryDetailIds, price: filter.price }, replace: true })
            }
        },
        searchProduct() {
            this.$router.push({ name: 'search', query: { keyword: this.keyword }, replace: true })
        }
    },
    computed: {
        // khai bao state su dung, use as this.userInfo
        //=> use như state
        ...mapState(useUserStore, {
            userInfo: "userInfo"
        }),
        ...mapState(useCartStore, {
            quantity: "quantity"
        }),
        getUserName() {
            return this.userInfo !== null ? this.userInfo.userName : ""
        },
        isLogged() {
            return this.userInfo !== null ? true : false
        },
        currentRouteName() {
            return this.$router.currentRoute.value.fullPath
        },
        isPathIncludeCategory() {
            return this.$router.currentRoute.value.fullPath.includes('category')
        },
        isPathIncludeyDiscountId() {
            return this.$router.currentRoute.value.fullPath.includes('discountId')
        },
        getQuantity() {
            return this.quantity
        }
    },
    mounted() {
        // get user from current local storage => commit to store
        const fetchData = async () => {
            await AuthenticationAPI.getUser()
                .then(res => {
                    // call commit to push userinfo to store
                    this.commitUserInfo(res.data)
                })
                .catch(err => {
                    this.commitUserInfo(null)
                })
            await ProductAPI.getAllCategory()
                .then(res => {
                    this.categories = res.data
                })
            await CartAPI.getCartItem()
                .then(res => {
                    this.commitCartQuantity(res.data.listCartItem.length)
                })
        }
        fetchData()
        window.addEventListener('scroll', this.handleScrollHeader)
    }
}

</script>
<template>
    <div class="header">
        <div class='top-header' :class="{ active: isShowTopHeader }">
            <nav class="top-header-content">
                <div v-if="isLogged" className="top-header-account">
                    <div className="title">
                        <div>
                            <!-- <img src="" class="avatar" alt="image" /> -->
                        </div>
                        <div class="text">
                            Xin chào, {{ getUserName }}
                        </div>
                    </div>
                </div>
                <div v-else class="top-header-account">
                    <RouterLink to='/login' class="none-underline login">
                        Đăng nhập
                    </RouterLink> |
                    <a class="none-underline login">
                        Đăng ký
                    </a>
                </div>

            </nav>
        </div>
        <div class='bot-header' :class="{ active: isShowBotHeader }">
            <div class="bot-header-content">
                <RouterLink class="icon" to="/">
                    Leo
                </RouterLink>
                <ul class="center-menu">
                    <div class='my-dropdown-menu' v-show="isShowCategoriesDropdownMenu"
                        @mouseleave="isShowCategoriesDropdownMenu = false"
                        @mouseenter="isShowCategoriesDropdownMenu = true">
                        <div class='my-dropdown-item' v-for="category in categories.categories">
                            <div class="category-title" :id="'category ' + category.CATEGORY_ID"
                                @click="goToProductPage">
                                {{ category.CATEGORY_NAME }}
                            </div>
                            <div class="list-item">
                                <div class='item' v-for="categoryDetail in category.category_details"
                                    :id="'categoryDetail ' + categoryDetail.CATEGORY_DETAIL_ID"
                                    @click="goToProductPage">
                                    <a class='none-underline'>
                                        {{ categoryDetail.CATEGORY_DETAIL_NAME }}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='my-dropdown-menu discount' v-show="isShowDiscountsDropdownMenu"
                        @mouseleave="isShowDiscountsDropdownMenu = false"
                        @mouseenter="isShowDiscountsDropdownMenu = true">
                        <div class='my-dropdown-item' v-for="discount in categories.discounts">
                            <div class="category-title" :id="'discount ' + discount.DISCOUNT_ID"
                                @click="goToProductPage">
                                {{ discount.DISCOUNT_NAME }}
                            </div>
                        </div>
                    </div>
                    <li>
                        <span class="menu-title">
                            <RouterLink to="/" class='none-underline'
                                :class="currentRouteName === '/' ? 'current-path' : ''">
                                <i class="bi bi-house-door-fill"></i>
                                <span>Trang chủ</span>
                            </RouterLink>
                        </span>
                    </li>
                    <li>
                        <span class="menu-title">
                            <RouterLink id='product all' class='none-underline' to="/products?price=0&price=2000000"
                                :class="currentRouteName === '/products?price=0&price=2000000' ? 'current-path' : ''">
                                Tất cả sản phẩm
                            </RouterLink>
                        </span>
                    </li>
                    <li>
                        <span class="menu-title" @mouseenter="isShowCategoriesDropdownMenu = true;
                        isShowDiscountsDropdownMenu = false">
                            <a class='none-underline' :class="{ 'current-path': isPathIncludeCategory }">
                                Thể loại
                                <i class="bi bi-caret-down-fill">

                                </i>
                            </a>
                        </span>
                    </li>
                    <li>
                        <span class="menu-title"
                            @mouseenter="isShowDiscountsDropdownMenu = true; isShowCategoriesDropdownMenu = false">
                            <a class='none-underline' :class="{ 'current-path': isPathIncludeyDiscountId }">
                                Giảm giá
                                <i class="bi bi-caret-down-fill"></i>
                            </a>
                        </span>
                    </li>
                    <li>
                        <span class="menu-title">
                            <a class='none-underline'>
                                Liên hệ
                            </a>
                        </span>
                    </li>
                </ul>
                <div class="search-input">
                    <input type='search' v-model="keyword" placeholder="Tìm sản phẩm" />
                    <button @click="searchProduct">
                        <i class="bi bi-search"></i>
                    </button>
                </div>
                <div>
                    <RouterLink class='none-underline cart-icon' :data-before="getQuantity" to="/cart">
                        <i class="bi bi-cart"></i>
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.top-header,
.bot-header {
    border-bottom: 1px solid rgb(219, 208, 208);
}

.top-header .login {
    color: white;
}

.bot-header {
    box-shadow: 0px 10px 35px -27px rgb(111, 108, 108);
}

.top-header-content {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    align-items: center;
    padding: 13px;
    background-color: #909b6b;
    color: white;
}

.top-header-content .top-header-account {
    text-decoration: none;
    display: flex;
    gap: 15px;
    position: relative;
}

.top-header-content .top-header-account .title {
    display: flex;
    gap: 8px;
    align-items: center;
    cursor: pointer;
    justify-content: center;
}

.top-header-content .top-header-account .title .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid rgb(219, 208, 208);
}

.top-header-content .top-header-account .title {
    font-weight: bold;
}

.top-header-content .top-header-account .component {
    position: absolute;
    margin-top: 25px;
    margin-left: -115px;
    z-index: 9;
    border: solid 1px rgb(219, 208, 208);
    border-radius: 3px;
    background-color: white;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 8px 19px;
    align-items: center;
    width: 130px;
    box-shadow: 0 0 25px 0 rgb(156, 154, 154);
}

.top-header-content .top-header-account .component .hello-user {
    color: rgb(63, 69, 76);
    font-size: 14px;
    align-self: flex-start;
}

.top-header-content .top-header-account .component .link {
    display: flex;
    gap: 5px;
    font-size: 15px;
    align-self: flex-start;
    align-items: center;
}

.top-header-content .top-header-account .component .link .icon {
    display: flex;
    align-items: center;
    color: rgb(63, 69, 76);
    color: white;
    text-decoration: none;
    cursor: pointer;
}

.top-header-content .top-header-account .component .link a {
    display: block;
}

/* .top-header-content .top-header-account .component::before {
    content: " ";
    position: absolute;
    border: solid 10px;
    margin-left: 23px;
    border-color: transparent transparent black transparent;
    margin-top: -20px;
} */

.top-header-content .top-header-account .component a {
    text-decoration: none;
    color: black;
}

.top-header-content .bar {
    display: none;
    font-size: 18px;
    transition: all 0.1s linear 0s;
    color: rgba(102, 102, 102, 0.85);
}

.top-header-content .bar :hover {
    cursor: pointer;
    color: black;
}

.bot-header-content .cart-icon {
    font-size: 32px;
    display: flex;
    justify-content: center;
    color: black;
    position: relative;
    font-weight: 650;
}

.bot-header-content .cart-icon:hover {
    color: black;
    cursor: pointer;
}

.bot-header-content .cart-icon::before {
    color: black;
    content: attr(data-before);
    position: absolute;
    font-size: 14px;
    align-self: center;
    margin-top: 1px;
    font-weight: bold;
}

.bot-header-content {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    padding: 25px 50px;
    font-size: 18px;
    background-color: white;
}

.bot-header-content .center-menu {
    display: flex;
    align-self: center;
    justify-content: center;
    gap: 25px;
    font-weight: 650;
    flex-grow: 2;
    list-style: none;
    margin: 0px;
    font-size: 18px;
}

.bot-header-content .center-menu a {
    cursor: pointer;
}

.bot-header-content .center-menu a:hover {
    color: #909b6b;
}

.bot-header-content .search-input {
    display: flex;
    align-items: center;
    flex-basis: 200px;
}

.bot-header-content .icon {
    flex-basis: 200px;
    font-size: 30px;
    cursor: pointer;
    align-items: center;
    display: flex;
    text-decoration: none;
    color: black;
}

.bot-header-content .search-input input {
    font-size: 16px;
    height: 40px;
    padding: 10px 12px;
    border: 1px solid rgb(219, 208, 208);
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    border-right: none;
}

.bot-header-content .search-input input:focus {
    outline: none;
}

.bot-header-content .search-input button {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgb(219, 208, 208);
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    cursor: pointer;
}

.bot-header-content .search-input button .search-icon {
    font-weight: 1000;
    font-size: 17px;
}


.header .active {
    position: fixed;
    z-index: 9999;
    width: 100%;
    box-shadow: 0 0 35px 0 rgb(224, 220, 220);
    top: 0;
    left: 0;
}


/* absolute dua vao position cha, neu ko co => html */
.center-menu .my-dropdown-menu {
    display: flex;
    width: 100%;
    position: absolute;
    justify-content: center;
    margin-top: 58px;
    margin-left: 43px;
    z-index: 9;
    background-color: white;
    animation-name: toggle-dropdownmenu;
    animation-duration: 0.2s;
    padding-top: 20px;
    border-bottom: solid 1px rgb(231, 227, 227);
}

@keyframes toggle-dropdownmenu {
    from {
        transform: translate(0px, 5px);
    }

    to {
        transform: translate(0px, 0px);
    }
}

.center-menu .active {
    display: flex;
}

.center-menu .discount {
    gap: 30px
}


/* .center-menu .menu-title:hover {
    cursor: pointer;
    border-bottom: solid 2px black;
} */

.my-dropdown-menu .my-dropdown-item {
    list-style: none;
    display: flex;
    flex-direction: column;
    padding-bottom: 30px;
}

.current-path {
    color: #909b6b;
}

.my-dropdown-menu .my-dropdown-item .item {
    text-transform: capitalize;
    width: 230px;
    font-weight: 400;
    font-size: 16px;
    padding: 15px 0px;
}

.center-menu .menu-title:hover,
.my-dropdown-menu .my-dropdown-item .item:hover,
.my-dropdown-menu .my-dropdown-item .category-title:hover {
    color: #909b6b;
}

.my-dropdown-menu .my-dropdown-item .category-title {
    margin-bottom: 10px;
    cursor: pointer;
}

@media screen and (max-width:886px) {
    .bot-header {
        display: none;
    }

    .top-header-content .top-header-account {
        display: none;
    }

    .top-header-content {
        justify-content: space-between;
        margin-right: 0;
        padding: 10px 15px;
    }

    .top-header-content .bar {
        display: flex;
        font-size: 30px;
        justify-content: center;
    }

    .top-header-content .cart-icon {
        font-size: 30px;
        margin-top: 0;
        color: rgba(102, 102, 102, 0.85);
    }
}
</style>