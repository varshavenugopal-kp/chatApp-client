import { useAppSelector } from '@/(Redux)/Store'
import { api } from '@/app/api/auth/[...nextauth]/(axios)/axios'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
import { useSession, signIn, signOut } from "next-auth/react"
import { logOut } from '@/(Redux)/userSlice'
import { allChats, allUser } from '@/app/api/auth/[...nextauth]/sevices'
import List from '../List/page'
import { list } from 'postcss'
import Image from 'next/image'
// import User from '../Users/page'
// import User from '../Users/page'


interface User {
    _id: string,
    email: string,
    name: string,
}

interface latest {
    chat: string,
    content: string
}

interface Chats {
    _id: string,
    chatName: string,
    users: User[],
    latestMessage: latest
}

interface Sender {
    _id: String
}

interface Message {
    _id: string
    user: User,
    content: string,
    chat: Chats
    createdAt: string,
    sender: Sender

}





const ENDPOINT = process.env.REACT_APP_BASE_URL as string
let socket: any


socket = io("http://localhost:8000")


const Chats = () => {

    const [chatList, setChatList] = useState<Chats[]>([])
    const [selectedUser, setselectedUser] = useState<Chats>()
    const [lastMessage, setLastMessage] = useState<Message>()
    const [newMessage, setNewMessage] = useState<string>("")
    const [message, setMessage] = useState<string>('')
    const [messages, setMessages] = useState<Message[]>([])
    const [filterList, setFilter] = useState<any>([])
    const scrollDownRef = useRef<HTMLDivElement | null>(null)
    const selectedRef = useRef<Chats>()
    const [users, setUsers] = useState<User[]>([])
    const [query, setQuery] = useState('')
    const [isChat,setIschat]=useState<Chats>()

    const dispatch = useDispatch()
    const { data: session, status } = useSession()
    const handleSignOut = async () => {
        dispatch(logOut())
        localStorage.clear()
        await signOut({ callbackUrl: `${window.location.origin}/login` });


    };



    //   useEffect(()=>{


    //     fetchUsers()


    //     const filteredList = users?.filter((user) => {
    //         const usernameMatch = user?.name
    //           .toLowerCase()
    //           .includes(query.toLowerCase());
    //         return usernameMatch
    //       });
    //       setFilter(filteredList);

    //   }, [query,users]);





    //   const fetchUsers=async()=>{
    //     try{

    //     const response=await allUser()

    //     if(response){
    //       setUsers(response?.userData)
    //     }
    //     }catch(error){

    //     }
    // }



    const mhdata = useAppSelector((state: any) => state.user)
    const userid = mhdata.value.userid

    const selectChat = (user: Chats) => {
        
console.log(user, "oooooooooooooooooooooooooooooiiiiiiiiiiiiiiiiiiiiiiiiiii");
          
        setselectedUser(user)
        selectedRef.current = user

    }

    useEffect(() => {
        socket.emit("setup", userid);
        userid&&fetchData()
    }, [messages,userid, isChat,list])   


    const fetchData =() => {
        
        

         allChats(userid).then((data: any) => {
            
            const lists = data?.map((obj: Chats) => {
                return {
                    ...obj,
                    users: obj.users.filter((item: { _id: string }) => item._id !== userid)
                };

            })
            setChatList(lists)
        });

    }



    const handleMessageFetch = async (chatId: string) => {

        const { data } = await api.get(`/send/${chatId}`);
        console.log(data,"heyyyyyy");
        
        setMessages(data);

        // socket.emit("setup", chatId);
        // return data.messages
    };




    const setMessageFn = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
    };

    const sendMessage = async (
        content: string,
        chatId: string | undefined,
        userid: string
    ) => {

        const { data } = await api.post(`/send`, {
            content,
            chatId,
            userid,

        });

        return data;
    };

    const handleMessageSent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (newMessage.trim().length > 0) {
            const res = await sendMessage(newMessage, selectedUser?._id, userid);
            socket.emit("stoptyping", userid)
            socket.emit("new message", res.message);
            setNewMessage("");



            setMessages([...messages, res.message]);
        }
    };

    useEffect(() => {
        socket.on("message recieved", (message: any) => {

            if (selectedRef?.current?.users[0]?._id === message.sender._id) {
                setMessages((messages) => [...messages, message])
            } else {

            }


        })
    }, [socket])

    useEffect(() => {
        if (scrollDownRef.current) {
            scrollDownRef.current.scrollTo({ top: scrollDownRef.current.scrollHeight, behavior: "smooth" })
        }
    }, [messages])


    return (
        <div>
            <div className="min-w-full border rounded lg:grid lg:grid-cols-3">

                <div className="border-r border-gray-300 lg:col-span-1">

                  
                    <div  className="overflow-auto h-[42rem]">
                    <div>
                   <ul>
                        <div>

                        </div>
                        <div className='h-16 bg-sky-950 flex justify-between items-center px-2'>

                            <div>
                                <h2 className="py-2 mb-2 text-lg text-white font-semibold pt-3">Chats</h2>
                            </div>
                            <div>
                                <button onClick={handleSignOut}>
                                    {/* <span>{email}</span> */}
                                    <span className="text-lg text-white font-semibold pt-3 mt-2">Logout</span>

                                </button>
                            </div>


                        </div>

                        {
                            chatList.map((obj) => (
                                <li key={obj._id} onClick={() => {
console.log(obj,"looooooooooooooooooooooooooooooo");

                                    selectChat(obj);
                                    handleMessageFetch(obj._id)
                                }}>
                                    <a className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none">
                                        <Image 
                                            className="object-cover w-10 h-10 rounded-full"
                                            src="data:image/png;base64,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"
                                            alt="username"
                                        />
                                        <div className="w-full pb-2">
                                            <div className="flex justify-between">
                                                <span className="block ml-2 font-semibold text-gray-600">

                                                </span>

                                            </div>
                                            <span className="block ml-2 text-sm text-gray-600">
                                                {obj?.users[0]?.name}
                                            </span>
                                            <span className="block ml-2 text-sm text-gray-600">
                                                {obj?.latestMessage?.content}
                                            </span>
                                        </div>
                                    </a>
                                </li>
                            ))
                        }


                    </ul>
                    </div>
                    <div>
                        <List selectChat={selectChat} handleMessageFetch={handleMessageFetch} setIschat={setIschat}/>
                    </div>
                    </div>
                   
                    <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
                        <input
                            type="text"
                            placeholder="Search here...."
                            className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}


                            required
                        />
                    </div>
                </div>

                

              
          
                        <div className='col-span-2'>



                        <div className="hidden lg:col-span-2 lg:block">
    
                            <div className="w-full">
    
                                <div className="relative flex items-center p-3 border-b border-gray-300 bg-sky-950">
                                    <Image 
                                        className="object-cover w-10 h-10 rounded-full"
                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAY1BMVEVVYIDn7O3///9TXn/q7/BLV3pOWnxfaYfk6etpc47u8/NZZINJVXlDUHV1fpZFUnb29/iepbR9hZvJzNWQl6q5vciIj6Ti4+jb3ePS1dw/THOttMCboLJxeZO/xc7U2t+prbxK4uQ/AAAF3klEQVRogb2b65qjIAyGUQSth2o924Od+7/KBXU6TgtJ6NDNj3322bW8fhFCgMBCV6vGpju19SHOGMviQ92eumasnJthTk+PXR8LZVJyzhbjXEr9L3HfjR8CB02fSSE34LNx9V9Z3wS+wVVTs1yamT8mc1Y3qUfwcI0LlLqxi/g6eAJPtRAWBxudLkQ9eQBPN6rYvewbikbAw/HsIHYn+3xDHA6Cq/Y97IruwcENgTvu7OS9Sdm9BY7q/G25m+i8to9rK7jJ/iR3E80bV/Cp+KPc1XhxcgJXdeEDq62szX3MCE5i4YvLmIgTKni0zQTvmZSmaGIAN6VXrvrQpaGLvYIbPDBzmZdFrqfhvChz3D9czDi4QT4vF0Vct5f5fr8Pg/pjvrR1XGAvm79ofgZPsJ95frhOSZSm0cPU35PpeoCjDS+f85MncAL6jefHOUij4MWiNJiPoGrOEwhcxVC4kvFson6zZ/DHPK4AcA19YNEnqQ2rLU3gn9d28AmKV0Vrl/stugUbONnADfSzvAXlbqLbHCI3ZnDAgd7BbwSuIh+gNrLICK6hvlGMiJ83b4+Q12RtAneQlyTF0auzodfPu1dwBY5gMdK4SjLUszmvXsDgm/IjUbCSfIMEyPYZPJyBx5m40MEXMNifhycw+J6MT6Sutfh6AnM1fvwNnkDBjCVUbhAkGdjSefoFRgTHZMFKcgy3ddyDJzi34wcXMBRDlBXTDgzGDs/gLYos4AHLOjy6Wg2R4QG+/l/w9RscxfCTnsFrSqDB4HToH7xOjwzvWt7BS/dS4AB5zjuY6XlZgRtoPvwIWGfZCtyjC2HfYNkvYDi2fgLMMg0e8ZW/d7AcFbjD18LewaJTYPwT6/TQAcwIinsFxl+Qy8YF3FC+Xcgq3NPiSk58tKVY6NdNVgzMCtfX43cHwUryHZcsBoYtxPVs7JD4aEvwrycahndqdzCSCmhwx0543PoAWJ4YmMh/DtyyGh9NHwDzmhEe+gT4xrC05zNghSXMTZ8A49gPgSn2ITBBcza4gQdKm4TOxfLZbZKY0SROdy6CW5yWTvjiaWnyRgggek+PLjlKe8L2vgogeMjU5JpKjpoDpUEVMvFJYnmQ6Oxopp3eqEmCkOsxPX/SyGlPG8JqWsQTgeUNidlPQujQqxBC6rMYJ4EjeK9pBx5YRXvHguZrarBUyR4hvdXGKf06nYkHdDq9pST02s6EVJMSOhaTLW0Jsz6LSk7BDeC9LUsYwqJtsRyVTJ8Ol0UbYZm6Plwj4PSLehTKM+LCfDUBT1LRnTz9bwtzfCtie084IYiO5CP2bSsiIvoaXrylJ/qZ87b5gm83Pciz/aCtKcnc7+0mfIPt23hmlZxSRxLbbbBVtODFtI+sYHo50M+WIrqJ6hf8s4kaDlQ/+QH/bBuTh7IP8H6jHDsa8Ar+dTQQHmk/8wD+fRiCHv/4Az8d/9CCCI/t49hR8AOcUCRLe2KfEj/WyxFf2BLGMhAykSPFRwsvh5phBZ2XryZv0IycESSbjnFDdI0nYygHiRpCaVL+U3qzO6pHooi4wblPOmdYzzYf1Ycp4Cwu+CXCUp/hKuAjXEtxQmifUmV5iih59XCFqkdt5Rhh+GUmy7INqLUJwbW0de/iK7SBQ9Oampf96LAVoVRzIxoquQmrl1U1L+sJ+7hPFhnRcJHRc/ULLw+zI1aT0/HKntBcgmVVOifYkUV8oX7cF3T7C40Wkql56jEYRXaC66hAU6r5oymevxQqWosFZd4O72M39Dau+WvJnqk8clLe5ufapSvb0Ou45qWhMNNUEDrwPJv+jl3QQV9IabrIYCyBjdrEuStb0d2BXAKrzI/elWwm2MqcvZFt1yashd2VH661jh6oofcgGrglAhXv/1k0dG0AvieROh4K7C2BL8VgN0Pe9neENIxeSaneGtERevOKcAnHHY1jqfed3A5DSE1Sb3hVRDZFrBOYxCZT3cCabYenldtNPjfwRq90Df0mMkoV0v32YPgPxM1cFe3gyO4AAAAASUVORK5CYII="
                                        alt="username"
                                    />
                                    <span className="block ml-2 text-white font-semibold">{selectedUser?.users[0]?._id==userid?selectedUser?.users[1]?.name:selectedUser?.users[0]?.name}</span>
    
                                    <span className="absolute w-3 h-3 rounded-full left-10 top-3"></span>
                                </div>
    
    
    
                                <div className="relative w-full p-6 overflow-y-auto h-[38rem]" ref={scrollDownRef} >
                                    <ul className="space-y-2">
                                        {messages.map((obj) => (
                                            <li
                                                className={`${obj?.sender?._id === userid
                                                        ? "justify-end"
                                                        : "justify-start"
                                                    } flex `}
                                            >
                                                <div
                                                    className={`relative max-w-xl px-4 py-2 text-gray-700 rounded shadow 
                    ${obj?.sender?._id != userid
                                                            ? "bg-gray-200"
                                                            : ""
                                                        }`}
                                                >
                                                    <span className="block">{obj?.content}</span>
                                                </div>
                                            </li>
                                        ))
                                        }
    
                                    </ul>
                                </div>
    
                                <form onSubmit={handleMessageSent} className="flex items-center justify-between w-full p-3 border-t border-gray-300">
    
    
                                    <input
                                        type="text"
                                        placeholder="Message"
                                        className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                                        name="message"
                                        onChange={(e) => setMessageFn(e)}
                                        value={newMessage}
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
                                </form>
                            </div>
                        </div>
                    </div>
                  
                      

              

            </div>
           
        </div>

    
    )
}

export default Chats
