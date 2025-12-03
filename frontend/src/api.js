import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api;

// if we want to have an authenticated response we just use api instead of axios
// some endpoints dont need to be an authenticaed response like posting to login or signup