import axiosPath from "../axiosPath";
class AuthenticationAPI {
    static async login(userName, password) {
        const data = {
            userName: userName,
            password: password
        }
        return await axiosPath.default().post('/api/account/login', data)
    }
    static async getUser() {
        return await axiosPath.authentication().get('/api/account/getUser')
    }
    static async register(newUser) {
        return await axiosPath.default().post('/api/account/register', newUser)
    }
    static async confirmToken(token) {
        return await axiosPath.default().put('/api/account/confirm/' + token)
    }
    static async getOrders() {
        return await axiosPath.authentication().get('/api/account/getOrders')
    }
}
export default AuthenticationAPI;