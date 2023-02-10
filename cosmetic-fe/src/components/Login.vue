<script>
import AuthenticationAPI from '../api/LoginAPI/authenticationAPI';
import { useUserStore } from '@/store/userStore'
import { mapState, mapActions } from 'pinia'
export default {
    data() {
        return {
            userName: '',
            password: ''
        }
    },
    methods: {
        // gives access to this.commitUserInfo and this.toggleLogged
        ...mapActions(useUserStore, ["commitUserInfo"]),
        login() {
            AuthenticationAPI.login(this.userName, this.password)
                .then(async res => {
                    localStorage.setItem('accessToken', res.data.accessToken);
                    localStorage.setItem('refreshToken', res.data.refreshToken);
                    await AuthenticationAPI.getUser()
                        .then(res => {
                            this.commitUserInfo(res.data)
                        })
                        .catch(err => {
                            this.commitUserInfo(null)
                        })
                    // call commit to push userinfo to store

                    this.$router.push('/')
                })
                .catch(err => {
                    console.log(err)
                })
        }
    },
    computed: {
        ...mapState(useUserStore, {
            userInfo: "userInfo",
        }),
        classObject() {
            return {
                active: this.isActive && !this.error,
                'text-danger': this.error && this.error.type === 'fatal'
            }
        }
    },
    mounted() {
        console.log(`The initial count is ${this.count}.`)
    }
}
</script>
<template>
    <div class='login-page'>
        <div class='login-container'>
            <div class='title-login'>
                Đăng nhập vào tài khoản của bạn
            </div>
            <form class='content-login'>
                <div class='form-group'>
                    <label>Tên tài khoản hoặc email</label>
                    <input type='text' class='input-login' placeholder='Tài khoản/Email' id='userName'
                        v-model="userName" />
                </div>
                <div class='form-group'>
                    <label>Mật khẩu</label>
                    <input type='password' class='input-login' placeholder='Nhập mật khẩu' id='password'
                        v-model="password" />
                </div>
                <input type='button' class='btn-login' value='Đăng nhập' @click="login" />
                <div class="none-underline bot">
                    <div>Đăng ký tài khoản?</div>
                    <a href='/account/forgot-password' class='none-underline'>
                        Quên mật khẩu?</a>
                </div>
            </form>
        </div>
    </div>
</template>
<style scoped>
.login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 10px;
    height: fit-content;
    box-shadow: 0 0 35px 0 rgb(191 188 188);
    background: #fff;
    gap: 13px;
    padding: 50px;
    width: 400px;
    align-items: center;
}

.login-page {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
}

.title-login {
    text-align: center;
    margin-bottom: 15px;
    font-weight: 500;
    font-size: 20px;
}

.content-login {
    display: flex;
    gap: 25px;
    flex-direction: column;
    justify-content: center;
    width: 100%;
}

.content-login .bot {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.content-login a {
    color: #909b6b;
    text-decoration: none;
}

.content-login label {
    display: block;
    font-weight: 490;
    font-size: 14px;
}

.content-login .form-group .input-login {
    background: #fff;
    border: 1px solid #d7dae3;
    color: #181c32;
    height: 40px;
    width: 100%;
    border-radius: 5px;
    margin-top: 8px;
}

.content-login .form-group .input-login:focus {
    outline: 1px solid #446fef;
}

.content-login .form-group label {
    font-weight: 500;
}

.content-login .save-forgot-account {
    display: flex;
    flex-direction: row;
    gap: 5px;
}

.content-login .save-forgot-account a {
    text-decoration: none;
    color: #3a7afe;
    display: block;
    align-self: flex-end;
    justify-self: end;
    flex-grow: 2;
    text-align: end;
}

.content-login .save-forgot-account div {
    display: flex;
    width: fit-content;
    text-align: center;
}

.content-login .save-forgot-account label {
    align-self: flex-end;
}

.content-login .btn-login {
    height: 45px;
    background-color: #909b6b;
    border-color: #909b6b;
    color: white;
    font-weight: 500;
    border-radius: 10px;
    padding: 5px 5px;
    border: 1px solid transparent;
    cursor: pointer;
}

.register {
    margin-top: 100px;
    padding-bottom: 100px;
}
</style>