import axios from 'axios';
class axiosPath {
    static authentication = () => {
        let access_token = localStorage.getItem('accessToken');
        return axios.create({
            baseURL: "http://localhost:8080",
            headers: { 'Authorization': 'Bearer ' + access_token }

        })
    }
    static default = () => {
        return axios.create({
            baseURL: "http://localhost:8080",
        })
    }
}
export default axiosPath;