"use client"
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { api } from '../api/auth/[...nextauth]/(axios)/axios';
type userAuth = {
  name: string;
  email: string;
  password: string;
};

const Register = () => {
  const [user, setUser] = useState<userAuth>({ name: '', email: '', password: '' });
  const addUser=((e: ChangeEvent<HTMLInputElement>)=>{
    setUser({...user,[e.target.name]:e.target.value})

})
const handleSignup=async(e:FormEvent)=>{
    e.preventDefault()
    try{
      // const {name,email,password}=user
     
     
          const {data}=await api.post('/register',{...user},{withCredentials:true})
          console.log(data,"data?????");

        
      }
      catch(error){

    }
  }
  console.log("user",user);
  
  return (
    <div>
      <div className='flex justify-center mt-20'>
        <form className='w-96 shadow-lg rounded px-8 pt-6 pb-8 mb-4'>
          <div className='w-70'>
            <div>
              <h1 className='text-center font-bold'>REGISTER</h1>
            </div>
            <div className='mt-4 w-full'>
              <label className='block text-gray-700 mb-2 ml-3 mt-2'>Name</label>
              <div className='w-full'>
                <input
                  type='text'
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='username'
                  placeholder='Name'
                  name='name'
                  onChange={addUser}
                ></input>
              </div>
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
                  onChange={addUser}
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
                  onChange={addUser}
                ></input>
              </div>
            </div>

            <div className='mt-5 flex justify-center'>
              <button className='bg-black text-white px-4 rounded h-9 w-80' onClick={handleSignup} >REGISTER</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
