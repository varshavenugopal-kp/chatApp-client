"use client"
import { useSession, signIn, signOut } from "next-auth/react"

import Chat from '@/Components/Chat/page';
import Message from '@/Components/Message/page';
import { useAppSelector } from '@/(Redux)/Store';
import { useDispatch } from "react-redux";
import { logIn, logOut } from "@/(Redux)/userSlice";
import { useEffect } from "react";


export default function Home() {

  const {data} = useSession()
  console.log(data,"this is session data");
  useEffect(()=>{
      
      data?.user?.email&&dispatch(logIn({userid:data.user.email, name:data.user.name as string}))
  },[data])
  
  const mhdata = useAppSelector((state: any) => state.user)
  console.log(mhdata,"this is mh data");
  
const dispatch=useDispatch()
  const {data:session,status}=useSession()
  const handleSignOut = async () => {
    dispatch(logOut())
    localStorage.clear()
    await signOut({ callbackUrl:`${window.location.origin}/login`});
  
    
  };

  
  return (
    <div>
       <div className="container mx-auto">
       <button className='bg-black text-white px-4 rounded h-9 w-80' onClick={handleSignOut} >signout</button>
    <div className="min-w-full border rounded lg:grid lg:grid-cols-3">
      <Chat/>
      <div className='col-span-2'>
  <Message/>
      </div>
    
    </div>
  
   
  
   
    </div>
    
   
    </div>
  )
}
