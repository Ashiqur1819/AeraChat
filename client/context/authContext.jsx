import { createContext, useEffect, useState } from "react";
import axios from "axios"
import toast from "react-hot-toast";

const backendUrl = import.meta.env.BACKEND_URL
axios.defaults.baseURL = backendUrl

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {

    const [token, setToken] = useState(localStorage.getItem("token"))
    const [authUser, setAuthUser] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [socket, setSocket] = useState(null)

    // Check authenticated user
    const checkAuth = async () => {
        try {
           const {data} = await axios.get("/api/auth/check")

           if(data.success){
            setAuthUser(data.user)
           }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Connect socket function
    

    useEffect(() => {
        if(token){
            axios.defaults.headers.common["token"] = token
        }
        checkAuth()
    }, [])

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )

}