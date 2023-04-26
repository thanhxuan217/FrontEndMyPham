import axiosPath from "../axiosPath";
class AccountAPI {
    static async getAll() {
        return await axiosPath.default().get('/api/admin/account/getAll')
    }
    static async activeAccount(data) {
        return await axiosPath.default().patch('/api/admin/account/activeAccount', data)
    }
    static async login(data) {
        return await axiosPath.default().post('/api/admin/account/login', data)
    }
}
export default AccountAPI