
import { useAppSelector } from '@/(Redux)/Store'
import { api } from '@/app/api/auth/[...nextauth]/(axios)/axios'
import { allChats } from '@/app/api/auth/[...nextauth]/sevices'
import { log } from 'console'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

interface User {
    _id: string,
    email: string,
    name: string,
}
interface chats{
   selectChat:Function
}
interface msg{
    handleMessageFetch:Function
}
interface isChats{
    isChat:Boolean
}

// const List = ({selectChat, handleMessageFetch}

const List = ({selectChat, handleMessageFetch, setIschat}: any) => {
   

    const mhdata = useAppSelector((state: any) => state.user)
    const userid = mhdata.value.userid
    const [userData, setUsers] = useState<User[]>([])
   

    useEffect(()=>{
        userid && fetchData()
    },[userid])
    const fetchData=async()=>{
        console.log("lklkkkj");
        
            const { data } = await api.get('/users')
            const list=data?.data.filter((item:any)=>{
                
                if(item._id != userid){
                    console.log(item,"this iiiiis item");
                    
                    return item
                }
            })
        
        
            console.log(list, ".................");
            
            setUsers(list)
            
        
    }


    const createChat=async( userid:String,receiverid:String)=>{
        
        const data= await api.post('/chat',{receiverid,userid})
        console.log(data,"created");
        return data.data
       
        
        
    }
   
  return (
    <div>
   <h1 className='text-center pt-5'> ALL USERS</h1>
        {
            userData?.map((obj)=>(
                <li className='list-none' key={obj._id} onClick={async ()=>{
                    const {chat} = await createChat( obj._id,userid)
                    handleMessageFetch(chat._id)
                    selectChat(chat)
                    setIschat(chat)
                }}>
                <a className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none">
                    <Image 
                     width={40}
                     height={40}
                        className="object-cover w-10 h-10 rounded-full"
                        src="data:image/png;base64,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"
                        alt="username"
                    />
                    <div className="w-full pb-2">
                        <div className="flex justify-between">
                            <span className="block ml-2 font-semibold text-gray-600">
                  {obj?.name}
                            </span>
                
                        </div>
                        <span className="block ml-2 text-sm text-gray-600">
                         
                        </span>
                       
                    </div>
                </a>
                </li>
            ))
        }
    
    </div>
  )
}

export default List
