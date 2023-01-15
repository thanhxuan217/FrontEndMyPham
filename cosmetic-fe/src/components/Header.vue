<script>
import { useUserStore } from '@/store/userStore'
import { mapState, mapActions } from 'pinia'
import AuthenticationAPI from '../api/LoginAPI/authenticationAPI';
export default {
    data() {
        return {
            isShowBotHeader: false,
            isShowTopHeader: false
        }
    },
    methods: {
        ...mapActions(useUserStore, ["commitUserInfo"]),
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
        }
    },
    computed: {
        ...mapState(useUserStore, {
            userInfo: "userInfo"
        }),
        getUserName() {
            return this.userInfo !== null ? this.userInfo.userName : ""
        },
        isLogged() {
            return this.userInfo !== null ? true : false
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
                            <img src="" class="avatar" alt="image" />
                        </div>
                        <div class="text">
                            Xin chào, {{ getUserName }}
                        </div>
                    </div>
                </div>
                <div v-else class="top-header-account">
                    <a href='/login' class="none-underline">
                        Đăng nhập
                    </a> |
                    <a class="none-underline">
                        Đăng ký
                    </a>
                </div>

            </nav>
        </div>
        <div class='bot-header' :class="{ active: isShowBotHeader }">
            <div class="bot-header-content">
                <div class="icon">

                </div>
                <div class="search-input">
                    <input type='search' placeholder="Tìm sản phẩm" />
                    <button>
                        <BsSearch class="search-icon" />
                    </button>
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
    font-size: 35px;
    display: flex;
    justify-content: center;
    color: black;
    position: relative;
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
    margin-top: 4px;
    font-weight: bold;
}

.bot-header-content {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    padding: 25px 50px;
    font-size: 18px;
}

.bot-header-content .center-menu {
    display: flex;
    align-self: center;
    justify-content: center;
    gap: 25px;
    font-weight: 700;
    flex-grow: 2;
    list-style: none;
    margin: 0px;
    text-transform: uppercase;
}

.bot-header-content .center-menu a {
    cursor: pointer;
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

.center-menu li {
    display: block;
    position: relative;
}

/* absolute dua vao position cha, neu ko co => html */
.center-menu .dropdown-menu {
    display: none;
    width: 250px;
    position: absolute;
    margin-top: 26px;
    z-index: 9;
    background-color: white;
    box-shadow: 0 0 35px 0 rgb(224, 220, 220);
    border-radius: 5px;
    animation-name: toggle-dropdownmenu;
    animation-duration: 0.2s;
}

.center-menu .dropdown-menu :hover {
    display: flex;
}

@keyframes toggle-dropdownmenu {
    from {
        /* height: 0px; */
        transform: translate(0px, 0px);
    }

    to {
        /* height: 200px; */
        transform: translate(0px, 0px);
    }
}

.center-menu .active {
    display: flex;
}

.center-menu .menu-title:hover {
    cursor: pointer;
    border-bottom: solid 2px black;
}

.dropdown-menu .dropdown-item {
    list-style: none;
    display: flex;
    flex-direction: column;
    padding: 0;
}

.dropdown-menu .dropdown-item .item {
    text-transform: capitalize;
    width: 230px;
    font-weight: 400;
    font-size: 16px;
    padding: 20px 10px;
    border-bottom: 1px solid rgb(227, 223, 223);
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