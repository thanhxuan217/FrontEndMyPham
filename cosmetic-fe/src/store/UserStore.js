import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => {
        return { userInfo: null }
    },
    // could also be defined as
    // state: () => ({ count: 0 })
    actions: {
        commitUserInfo(userInfo) {
            this.userInfo = userInfo
        },
    },
})