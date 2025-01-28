import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });

		if (password !== confirmPassword) {
			set({ loading: false });
			return toast.error("Passwords do not match");
		}

		try {
			const res = await axios.post("/auth/signup", { name, email, password });
			set({ user: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred");
		}
	},
	login: async (email, password) => {
		set({ loading: true });

		try {
			const res = await axios.post("/auth/login", { email, password });

			set({ user: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred");
		}
	},

	logout: async () => {
		try {
			await axios.post("/auth/logout");
			set({ user: null });
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred during logout");
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axios.get("/auth/profile");
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.log(error.message);
			set({ checkingAuth: false, user: null });
		}
	},

	refreshToken : async () => {
		const checkingForAuthentication = get().checkingAuth;
		if(checkingForAuthetication){
			return ;
		}

		set({ checkingAuth: true });
		try{
			const res = await axios.post("/auth/refresh-token");
			set({checkingAuth: false});
			return res.data;

		}catch(error)
		{
			set({checkingAuth: false, user: null});
			throw error;

		}
	}

}))



//Adding an interceptor: Whenveer while making a req if accessToken expires in the background this interceptor will call refreshToken and generate a new accessToken and then make the original request again.
//This is a global interceptor that will be called for every request, which fails with n error code : 401

let refreshPromise = null;
axios.interceptors.response.use(
	(response) => response,
	async(error) => {
		const originalRequest = error.config;
		if(error.response.status === 401 && !originalRequest._retry){
			
			originalRequest._retry = true;
			try{
				if(refreshPromise){
					await refreshPromise;
					return axios(originalRequest);
				}

				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);

			}catch(refreshError){
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
	
			}

		}
		refreshPromise.reject(error);

		
	}
);