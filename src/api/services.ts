import { request } from "./request"
type LoginResponse = {
    username: string,
    password: string,
    accessToken: string,
    refreshToken: string
}
export const login = async (data: string) => {
    return request<LoginResponse>({
        url: "auth/login",
        method: "POST",
        data
    })
}