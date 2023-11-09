"use client"
import React, { ReactNode } from 'react'
import { SessionProvider } from "next-auth/react"
type AuthProviderProps = {
    children: ReactNode;
  };
const AuthProvider = ({children}:AuthProviderProps) => {
  return (
   <SessionProvider>
     {children}
   </SessionProvider>
  )
}

export default AuthProvider
