import { api } from '@/app/api/auth/[...nextauth]/(axios)/axios'
import { Message } from 'postcss'
import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'


interface User{
  _id:string,
  email:string,
  name:string,
}

interface latest{
  chat:string,
  content:string
}
interface Chats{
  _id:string,
  chatName:string,
  users:User[],
  latestMessage:latest
}
interface selectedUser {
  user: Chats
  userid: string 
  setLastMessage:Function
}
const Messag:React.FC<selectedUser>  = ({ user, userid ,setLastMessage }) => {

  const ENDPOINT=process.env.REACT_APP_BASE_URL as string
  let socket:any
  socket=io(ENDPOINT)
  
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const scrollDownRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setisOpen] = useState(false)

  const setMessageFn = (e: React.ChangeEvent<HTMLInputElement>) => {

    setMessage(e.target.value)
  }

  const sendMessage = async (
    content: string,
    chatId: string,
    userid: string
  ) => {
   
    const { data } = await api.post(`/send`, {
      content,
      chatId,
      userid
    });
    
    return data;
  };


  const handleMessageSent = async () => {
    if (message.trim().length > 0) {
      const res = await sendMessage(message, user?._id, userid)
      setMessage('')
      socket?.emit('new message', res.msg)
      setLastMessage(res.msg)
      setMessages([...messages, res.msg])

    }
  }
  useEffect(() => {

    socket.emit('setup', userid)
    return () => {
      socket.disconnect();
    }
  }, [userid])


  const handleMessageFetch = async (chatId: string) => {
  
    const { data } = await api.get(`/send/${chatId}`);
    setMessages(data.messages);
    
    socket.emit("join chat", chatId);
    // return data.messages
  };

  const fetchAllMessages=async(chatId:string)=>{
    const {data}= await api.get(`/send/${chatId}`)
    
    return data.messages
}

  useEffect(() => {
    const fetch = async () => {
     
      const msgs = await fetchAllMessages(user?._id)
      
      setMessages(msgs)
      socket.emit('join chat', user?._id)
      
    }
    fetch()
  }, [user])
  useEffect(() => {
    if (scrollDownRef.current) {
      scrollDownRef.current.scrollTo(0, scrollDownRef.current.scrollHeight)
    }
  }, [messages])

  

  


  useEffect(() => {
    socket.on('message recieved', (newMessage: Message) => {
      if (user._id !== newMessage.chat._id) {

      } else {
        setMessages((messages) => [...messages, newMessage])
      }
    })
  })






  

  return (
    <div>
       <div className="hidden lg:col-span-2 lg:block">
      
      <div className="w-full">

         <div className="relative flex items-center p-3 border-b border-gray-300 bg-sky-950">
          <img
            className="object-cover w-10 h-10 rounded-full"
            src="data:image/png;base64,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"
            alt="username"
          />
          <span className="block ml-2 text-white font-semibold">hfhghghg</span>
          <span className="absolute w-3 h-3 rounded-full left-10 top-3"></span>
        </div>
      


        
        {/* <div className="relative w-full p-6 overflow-y-auto h-[40rem]">
          <ul className="space-y-2">
           
            <li className="flex justify-start">
              <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                <span className="block">Hi</span>
              </div>
            </li>
            <li className="flex justify-end">
              <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                <span className="block">Hiiii</span>
              </div>
            </li>
            <li className="flex justify-end">
              <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                <span className="block">how are you?</span>
              </div>
            </li>
          <li className="flex justify-start">
              <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                <span className="block">gfhgfgghgh
                </span>
              </div>
            </li>
          </ul>
        </div> */}


<div className="relative w-full p-6 overflow-y-auto h-[40rem]" >
            <ul className="space-y-2">
              { messages.map((obj) => (
                    <li
                      className={`${
                        obj.user?._id && obj.user?._id === userid
                          ? "justify-end"
                          : "justify-start"
                      } flex `}
                    >
                      <div
                        className={`relative max-w-xl px-4 py-2 text-gray-700 rounded shadow 
                ${
                  obj.user?._id && obj.user?._id === userid
                    ? "bg-gray-100"
                    : ""
                }`}
                      >
                        <span className="block">{obj.content}</span>
                      </div>
                    </li>
                  ))
               }

              {/* <li className="flex justify-start">
                <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                  <span className="block">Hi</span>
                </div>
              </li>
              <li className="flex justify-end">
                <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                  <span className="block">Hiiii</span>
                </div>
              </li>
              <li className="flex justify-end">
                <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                  <span className="block">how are you?</span>
                </div>
              </li> */}
              {/* <li className="flex justify-start">
                <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                  <span className="block">Edii Varsha kuttyyy happy birthday.......
                  </span>
                </div>
              </li> */}
            </ul>
          </div>

        <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
         

          <input
            type="text"
            placeholder="Message"
            className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
            name="message"
            required
          />
         
          <button
            type="submit"
           
          >
            <svg
              className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Messag
