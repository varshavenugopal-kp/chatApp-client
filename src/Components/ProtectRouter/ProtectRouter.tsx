"use client"
import { useAppSelector } from '@/(Redux)/Store';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from "next-auth/react"
import React, { Children, useState } from 'react'






interface UserProtectedRouterProps {
    children: React.ReactNode
}


const ProtectedRouter:React.FC<UserProtectedRouterProps> = ({ children}): any => {

  const {status} = useSession()
    const router=useRouter()
    const username = useAppSelector((state) =>
    state.user.value.userid
  );
    
    if(status!="loading"){
      return username.length>1||status=="authenticated" ? children:router.push('/login')
    }
    
    
}
export default ProtectedRouter