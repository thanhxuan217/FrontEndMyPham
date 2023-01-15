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
}
export default AuthenticationAPI;