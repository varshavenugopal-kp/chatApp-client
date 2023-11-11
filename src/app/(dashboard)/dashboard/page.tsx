"use client"
import { useSession, signIn, signOut } from "next-auth/react"


import { useAppSelector } from '@/(Redux)/Store';
import { useDispatch } from "react-redux";
import { logIn, logOut } from "@/(Redux)/userSlice";
import { useEffect } from "react";
import Chats from "@/Components/Chats/page";


export default function Home() {

    const { data } = useSession()
    useEffect(() => {

        data?.user?.email && dispatch(logIn({ userid: data.user.email, name: data.user.name as string }))
    }, [data])

    const mhdata = useAppSelector((state: any) => state.user)
    const userid = mhdata.value.userid

    const dispatch = useDispatch()
    const { data: session, status } = useSession()
    const handleSignOut = async () => {
        dispatch(logOut())
        localStorage.clear()
        await signOut({ callbackUrl: `${window.location.origin}/login` });


    };


    return (
        <div>
            <div className="container mx-auto">
                {/* <button className='bg-black text-white px-4 rounded h-9 w-24' onClick={handleSignOut} >signout</button> */}
                <Chats />




            </div>


        </div>
    )
}
