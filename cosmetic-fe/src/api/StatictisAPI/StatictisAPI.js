import axiosPath from "../axiosPath";
class StatictisAPI {
    static async getRevenue(data) {
        return await axiosPath.default().post('/api/admin/statictis/getRevenue', data)
    }
    static async getPopularProduct(data) {
        return await axiosPath.default().post('/api/admin/statictis/getPopularProduct', data)
    }
}
export default StatictisAPI