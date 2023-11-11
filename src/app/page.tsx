"use client"
import Image from 'next/image'
import React from 'react'
import '../../public/Styles/Style.css'
import { useRouter } from 'next/navigation'

const Login = () => {
  const router=useRouter()
  const handlegetIn=()=>{
    router.push('/login')
  }
  return (
    <div>
   {/* <div className='mt-16 px-2 md:px-10'>
            <div className='grid grid-cols-12'>
                <div className='md:col-span-6 col-span-12 flex flex-col flex-shrink-0 justify-center items-center'>
                    <Image alt='logo' src='./logo.png' className='rounded-full' width={320} height={} /> 
                    <button className='bg-gray-400 p-1 px-2 rounded-xl text-gray-200'>Let's talk</button>
                </div>
                <div className='md:col-span-6 col-span-12 relative flex md:justify-end justify-center animate-varu'>
                    <img src='./chatImg.png' alt='home image' />
                </div>
            </div>
        </div> */}
        <div className='mt-16 px-2 md:px-10'>
           <div className='grid grid-cols-12'>
           <div className='md:col-span-6 col-span-12 flex flex-col flex-shrink-0 justify-center items-center'>
                    <Image alt='logo' src='/Images/chat.png' className='rounded-full' width={320} height={500} />
                    {/* <img alt='logo' src='./logo.png' className='w-[20rem] rounded-full' /> */}
                    <button className='bg-emerald-600 p-1 px-2 h-10 rounded-xl text-gray-200 w-36' onClick={handlegetIn}>Get started</button>
                </div>
                <div className='md:col-span-6 col-span-12 relative flex md:justify-end justify-center animate-varu'>
                    <Image src='/Images/chatImg.png' alt='home image ' width={500} height={480} />
                </div>
           </div>
        </div>
    </div>
  )
}

export default Login


