import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

const tkFetch = {
    get<T>(url: string, options?: AxiosRequestConfig): () => Promise<T> {
        return async () => {
            try {
                const res: AxiosResponse<ApiResponse<T>> = await axios.get(url, options);
                if (!res.data.success) {
                    throw new Error(res.data.message);
                }
                return res.data.data;
            } catch (err: any) {
                const resData = err.response?.data;
                if (resData && resData.message) {
                    throw new Error(resData.message);
                } else {
                    throw new Error('Something went wrong on our side. Please try again later.');
                }
            }
        };
    },

    post<T>(url: string, options?: AxiosRequestConfig): (body: any) => Promise<T> {
        return async (body: any) => {
            try {
                const res: AxiosResponse<ApiResponse<T>> = await axios.post(url, body, options);
                if (!res.data.success) {
                    throw new Error(res.data.message);
                }
                return res.data.data;
            } catch (err: any) {
                const resData = err.response?.data;
                if (resData && resData.message) {
                    throw new Error(resData.message);
                } else {
                    throw new Error('Something went wrong on our side. Please try again later.');
                }
            }
        };
    },

    postWithBody<T>(url: string, body: any, options?: AxiosRequestConfig): () => Promise<T> {
        return async () => {
            try {
                const res: AxiosResponse<ApiResponse<T>> = await axios.post(url, body, options);
                if (!res.data.success) {
                    throw new Error(res.data.message);
                }
                return res.data.data;
            } catch (err: any) {
                const resData = err.response?.data;
                if (resData && resData.message) {
                    throw new Error(resData.message);
                } else {
                    throw new Error('Something went wrong on our side. Please try again later.');
                }
            }
        };
    },

    postWithIdInUrl<T>(url: string, options?: AxiosRequestConfig): (body: { id: string }) => Promise<T> {
        return async (body: { id: string }) => {
            if (!body.id) {
                throw new Error('Id is required, for post with ID function');
            }
            try {
                const res: AxiosResponse<ApiResponse<T>> = await axios.post(`${url}/${body.id}`, body, options);
                if (!res.data.success) {
                    throw new Error(res.data.message);
                }
                return res.data.data;
            } catch (err: any) {
                const resData = err.response?.data;
                if (resData && resData.message) {
                    throw new Error(resData.message);
                } else {
                    throw new Error('Something went wrong on our side. Please try again later.');
                }
            }
        };
    },

    delete<T>(url: string, options?: AxiosRequestConfig): () => Promise<T> {
        return async () => {
            try {
                const res: AxiosResponse<ApiResponse<T>> = await axios.delete(url, options);
                if (!res.data.success) {
                    throw new Error(res.data.message);
                }
                return res.data.data;
            } catch (err: any) {
                const resData = err.response?.data;
                if (resData && resData.message) {
                    throw new Error(resData.message);
                } else {
                    throw new Error('Something went wrong on our side. Please try again later.');
                }
            }
        };
    },

    deleteWithIdInUrl<T>(url: string, options?: AxiosRequestConfig): (data: { id: string }) => Promise<T> {
        return async (data: { id: string }) => {
            if (!data.id) {
                throw new Error('Id is required, for delete with ID function');
            }
            try {
                const res: AxiosResponse<ApiResponse<T>> = await axios.delete(`${url}/${data.id}`, options);
                if (!res.data.success) {
                    throw new Error(res.data.message);
                }
                return res.data.data;
            } catch (err: any) {
                const resData = err.response?.data;
                if (resData && resData.message) {
                    throw new Error(resData.message);
                } else {
                    throw new Error('Something went wrong on our side. Please try again later.');
                }
            }
        };
    },

    patch<T>(url: string, options?: AxiosRequestConfig): (body: any) => Promise<T> {
        return async (body: any) => {
            try {
                const res: AxiosResponse<ApiResponse<T>> = await axios.patch(url, body, options);
                if (!res.data.success) {
                    throw new Error(res.data.message);
                }
                return res.data.data;
            } catch (err: any) {
                const resData = err.response?.data;
                if (resData && resData.message) {
                    throw new Error(resData.message);
                } else {
                    throw new Error('Something went wrong on our side. Please try again later.');
                }
            }
        };
    },

    patchWithIdInUrl<T>(url: string, options?: AxiosRequestConfig): (body: { id: string }) => Promise<T> {
        return async (body: { id: string }) => {
            if (!body.id) {
                throw new Error('Id is required, for patch with ID function');
            }
            try {
                const res: AxiosResponse<ApiResponse<T>> = await axios.patch(`${url}/${body.id}`, body, options);
                if (!res.data.success) {
                    throw new Error(res.data.message);
                }
                return res.data.data;
            } catch (err: any) {
                const resData = err.response?.data;
                if (resData && resData.message) {
                    throw new Error(resData.message);
                } else {
                    throw new Error('Something went wrong on our side. Please try again later.');
                }
            }
        };
    },

    put<T>(url: string, options?: AxiosRequestConfig): (body: any) => Promise<T> {
        return async (body: any) => {
            try {
                const res: AxiosResponse<ApiResponse<T>> = await axios.put(url, body, options);
                if (!res.data.success) {
                    throw new Error(res.data.message);
                }
                return res.data.data;
            } catch (err: any) {
                const resData = err.response?.data;
                if (resData && resData.message) {
                    throw new Error(resData.message);
                } else {
                    throw new Error('Something went wrong on our side. Please try again later.');
                }
            }
        };
    },

    putWithIdInUrl<T>(url: string, options?: AxiosRequestConfig): (body: { id: string }) => Promise<T> {
        return async (body: { id: string }) => {
            if (!body.id) {
                throw new Error('Id is required, for put with ID function');
            }
            try {
                const res: AxiosResponse<ApiResponse<T>> = await axios.put(`${url}/${body.id}`, body, options);
                if (!res.data.success) {
                    throw new Error(res.data.message);
                }
                return res.data.data;
            } catch (err: any) {
                const resData = err.response?.data;
                if (resData && resData.message) {
                    throw new Error(resData.message);
                } else {
                    throw new Error('Something went wrong on our side. Please try again later.');
                }
            }
        };
    },
};

export default tkFetch;