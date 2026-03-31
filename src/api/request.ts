import { isAxiosError, type AxiosRequestConfig } from "axios"
import { api } from "./api"

export const request = async <T>(requestConfig: AxiosRequestConfig) => {
    try {
        const response = await api(requestConfig)
        return response.data as T
    } catch (error) {
        if (isAxiosError(error)) throw new Error(error.response?.data.message || error.message)
        else throw new Error(String(error))
    }
}