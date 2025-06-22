import React from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'
import {useState} from 'react'
import dft from "../../images/default.jpeg";
import registerImg from "../../images/login.png";
import loginImg from "../../images/register.png";

const Form = ({
  isSignInPage=false
}) => {
  const navigate=useNavigate();
  const [data, setData] = useState({
    ...(!isSignInPage && {userName:'' , profilePic:dft}),email:'',password:''
  })
  const handleSubmit=async (e)=>{
    e.preventDefault();
    const res=await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/${isSignInPage ? 'login': 'register'}`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        Authorization: `Bearer ${localStorage.getItem('user:token')}`
      },
      body:JSON.stringify({...data})
    })
    if(res.status===200 && isSignInPage){
      const {token} =await res.json();
      localStorage.setItem('user:token',token);
      navigate('/');
    }
    else if(res.status===401 && isSignInPage){
      alert("Invalid Credentials");
    }
    else if(isSignInPage){
      alert("Error,Please try later");
    }
    else if(res.status===200){
      navigate("/account/signin");
    }
    else if(res.status===400){
      alert("Username already exists");
    }
    else{
      alert("Error,Please try later");
    }
  }
  return (
    <div className='bg-[#d2cfdf] h-screen w-full flex justify-center items-center'>
        <div className='h-[80%] w-[70%] bg-white flex justify-center items-center'>
            <div className={`h-full w-full flex flex-col justify-center items-center ${!isSignInPage && 'order-2'}`}>
                <div className='text-4xl font-serif text-4xl font-bold'>WELCOME {isSignInPage && 'BACK'}</div>
                <div className='mb-[7%] font-sans text-xl'>Please {isSignInPage ?'Login':'Sign Up'} to continue</div>
                <form className='w-[60%]' onSubmit={(e)=>{handleSubmit(e)}}>
                  {
                    !isSignInPage && 
                    <Input label='Username' type='text' placeholder='Enter Your UserName' value={data.userName} onChange={(e)=>setData({...data,userName:e.target.value})} className='rounded-2xl font-sans'/>
                  }
                    <Input label='Email' type='text' placeholder='Enter Your Email' value={data.email} onChange={(e)=>setData({...data,email:e.target.value})} className='rounded-2xl font-sans'/>
                    <Input label='Password' type='password' placeholder='Enter Your password' value={data.password} onChange={(e)=>setData({...data,password:e.target.value})} className='rounded-2xl font-sans'/>
                    <Button label={isSignInPage ? 'Sign in' : 'Register'} className='my-5 bg-[#8d91f4] hover:bg-[#525197] w-full rounded-2xl font-sans text-xl'/>
                </form>
                <div className='cursor-pointer text-md hover:text-blue-700 underline font-Merriweather' onClick={()=>navigate(`${isSignInPage? '/account/signup' : '/account/signin'}`)}>{isSignInPage ? 'Create New Account':'Sign in'}</div>
            </div>
            <div className='h-full w-full bg-[#F2F5F8] flex justify-center items-center'>
                   {
                    isSignInPage ? <img src={registerImg} style={{ width: '100%', height: '100%', objectFit: 'fit' }} alt="Sign In "/> :
                     <img src={loginImg} style={{ width: '100%', height: '100%', objectFit: 'fit' }} alt="Register"/>
                    }
            </div>
        </div>
    </div>
  )
}
export default Form