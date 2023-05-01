import axiosPath from "../axiosPath";
class RatingAPI {
    static async rating(data) {
        return await axiosPath.authentication().post('/api/rating/addNew', data)
    }
}
export default RatingAPI