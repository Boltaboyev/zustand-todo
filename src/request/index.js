import axios from "axios"

export const request = axios.create({
    baseURL: "https://67a2eab7409de5ed5256be7b.mockapi.io/",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
})


