    import axios from "axios";

    //create axios with token
    export function createAxiosWithToken() {
        const token = localStorage.getItem('token');
        console.log(token)
        return axios.create({
            headers: { Authorization: `Bearer ${token}` }
        });
    }