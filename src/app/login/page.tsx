"use client"
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { Session } from 'inspector';
import { useRouter } from 'next/navigation'
import { api } from '../api/auth/[...nextauth]/(axios)/axios';
import { useDispatch } from 'react-redux';
import { logIn } from '@/(Redux)/userSlice';

type userAuth = {
    name: string;
    email: string;
    password: string;
  };

const Login = () => {
    const [user, setUser] = useState<userAuth>({ name: '', email: '', password: '' });
    const dispatch=useDispatch()
    const router=useRouter()
    // const [data,setData]=useState<>
    const [email,setEmail]=useState<String>()
  const [password,setPassword]=useState<String>()
  const addUser=((e: ChangeEvent<HTMLInputElement>)=>{
    setUser({...user,[e.target.name]:e.target.value})

})

  const {data:session,status}=useSession()
  
  const handleSignIn = async () => {
     signIn("github",{
      redirect:false,
      callbackUrl:`${window.location.origin}/dashboard`
    }
)
    
  };


  const userLogin=async(e:FormEvent)=>{
    
    e.preventDefault()
   
      const {data}= await api.post('/login',{email,password})
  
     
        
      if(data){
        localStorage.setItem("userInfo", JSON.stringify(data))
      dispatch(logIn({userid:data._id, name:data.name}))
      }
      
     router.push('/dashboard')
  }
  

  return (
    <div>
       <div className='flex justify-center mt-20'>
        <form className='w-96 shadow-lg rounded px-8 pt-6 pb-8 mb-4' onSubmit={userLogin}>
          <div className='w-70'>
            <div>
              <h1 className='text-center font-bold'>LOGIN</h1>
            </div>
        

            <div className='mt-4 w-full'>
              <label className='block text-gray-700 mb-2 ml-3 mt-2'>Email</label>
              <div className='w-full'>
                <input
                  type='email'
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='username'
                  placeholder='Email'
                  name='email'
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                ></input>
              </div>
            </div>

            <div className='mt-4'>
              <label className='block text-gray-700 mb-2 ml-3 mt-2'>Password</label>
              <div className='w-full'>
                <input
                  type='password'
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='username'
                  placeholder='Password'
                  name='password'
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                ></input>
              </div>
            </div>

            <div className='mt-5 flex justify-center'>
              <button type='submit' className='bg-black text-white px-4 rounded h-9 w-80' >LOGIN</button>
            </div>

            <div className='mt-5 flex justify-center'>
              <button type='button' className='bg-black text-white px-4 rounded h-9 w-80 text-sm' onClick={handleSignIn} >Sign in using github</button>
            </div>
          </div>
        </form>
      </div>
      
    </div>
  )
}

export default Login
