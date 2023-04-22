import axiosPath from "../axiosPath";
class AccountAPI {
    static async getAll() {
        return await axiosPath.default().get('/api/admin/account/getAll')
    }
}
export default AccountAPI