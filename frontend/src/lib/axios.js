import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.env.NODE_ENV === "development" ? "http://localhost:5000/api" : "/api",
	withCredentials: true, // send cookies to the server
});



export default axiosInstance;