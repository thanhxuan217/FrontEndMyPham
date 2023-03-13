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
}
export default AuthenticationAPI;