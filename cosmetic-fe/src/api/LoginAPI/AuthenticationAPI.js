import axiosPath from "../axiosPath";
class AuthenticationAPI {
    static async login () {
        return await axiosPath.post('/login')
    }
}
export default AuthenticationAPI;