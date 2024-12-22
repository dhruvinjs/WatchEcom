import React, { useState } from "react";
import { useContext,createContext } from "react";

const AuthContext=createContext()


export const AuthProvider=({ children })=>{
    const [user,setUser]=useState(null)

    const login=(userInfo)=>{
        setUser(userInfo)
    }

    const signOut=()=>{
        setUser(null)
    }
    return(
        <AuthContext.Provider value={{user,signOut,login}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () =>{
    return useContext(AuthContext)};