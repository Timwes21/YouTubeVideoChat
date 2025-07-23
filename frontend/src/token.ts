const tokenName = "YTSUMTOKEN"

export const getToken = () => {
    return localStorage.getItem(tokenName);
}

export const setToken = (token: string) => {
    localStorage.setItem(tokenName, token)
}