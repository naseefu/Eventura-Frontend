import React, { useEffect, useState } from 'react'
import './signup.css'
import logo from '../images/logo.png'
import logo1 from '../images/logo1.png'
import Bitmojees from '../bitmoji/Bitmojees'
import ApiService from '../../service/ApiService'
import { useNavigate } from 'react-router-dom'
import DynamicPage from '../Commons/DynamicPage'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowUpRight } from 'lucide-react'
import 'font-awesome/css/font-awesome.min.css';
import { useUser } from '../Context/UserContext'
import img from '../images/grad6.jpg'
import CryptoJS from 'crypto-js'

const Signin = () => {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  const {login} = useUser()

  const [isLoading,setLoading] = useState(false)

  const [feedbacks,setFeedbacks] = useState()

  const [i,setI] = useState(0)
  useEffect(()=>{
    const getFeeback=async()=>{
      try{
        const response = await ApiService.getSomeFeedback();
        setFeedbacks(response.websiteFeedbackDTOs)
      }
      catch(err){
        console.log(err.response?.data?.message||"An error occured")
      }
    }
    getFeeback()
  },[])

  useEffect(() => {
    const interval = setInterval(() => {
      setI((prevI) => (prevI + 1) % (feedbacks ? feedbacks.length : 1));
    }, 2000)
    return () => clearInterval(interval)
  }, [feedbacks]) 

  const navigate = useNavigate()

  useEffect(()=>{
    if(error){
    setTimeout(()=>{
      setError('')
    },3000)}
  },[error])

  const secretKey = 'optimusxpain123123as7812938kashjkjasjkbkasf';
  const encryptId = (id) => {
  const ciphertext = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
  return ciphertext.replace(/\//g, '_');
  };

  const handleLogin=async()=>{
    setLoading(true)
    try{
        
      const response = await ApiService.loginUser({email,password})
      setLoading(false)
      const expirationDate = new Date().getTime() + 365 * 24 * 60 * 60 * 1000;
      localStorage.setItem('token',response.token)
      localStorage.setItem('user',response.userDTO)
      localStorage.setItem("authTokenExpiration", expirationDate.toString());
      login(response.userDTO)
      navigate('/')

    }
    catch(err){
      setLoading(false)
      if(err.response?.data?.statusCode===403){
        navigate(`/otp/${encryptId(err.response?.data?.userDTO.id)}`)
        return;
      }
      else{
        setError(err.response?.data?.message || err.message || "An error occured")
      }
    }
  }

  return (
    <div>
    <DynamicPage title="Login" description="Login page of Eventura"/>
    <div className='register' style={{minHeight:'100vh'}}>
      <div className='reg1' style={{backgroundImage:`url(${img})`}}>
        <div className='logo'>
          <img src={logo} alt='E'/>
          <p onClick={()=>navigate('/')}>Go Home <span><ArrowUpRight className='arrow' size={15} /></span></p>
        </div>
        <div>
          <h1>Continue your journey with us.</h1>
          <p>Discover the perfect venue, plan unforgettable experiences, and connect with top-notch vendors to make your events extraordinary.</p>
        </div>
        <div className='feeddot'>
        {feedbacks && <div className='feedcard'>
            <div>
              <p>{feedbacks[i].feedback.slice(0,100)}{feedbacks[i].feedback.length>100&&"..."}</p>
            </div>
            <div className='feeduser'>
              <img src={feedbacks[i].profilepicture} alt='E' style={{borderRadius:'40px',height:'35px'}}/>
              <h3>{feedbacks[i].firstname} {feedbacks[i].lastname}</h3>
            </div>
        </div>}
        <div className='dots'>
          <div style={{backgroundColor:i===0&&'white'}} className='dot'></div>
          <div style={{backgroundColor:i===1&&'white'}} className='dot'></div>
          <div style={{backgroundColor:i===2&&'white'}} className='dot'></div>
          <div style={{backgroundColor:i===3&&'white'}} className='dot'></div>
        </div></div>
      </div>

      <div className='reg2 signin1' style={{color:'black'}}>
        <div style={{paddingBottom:'20px',textAlign:'center',width:'70%'}}>
          <img src={logo1} style={{height:"35px",marginBottom:"15px"}} alt='E'/>
          <h1>Hello Again!</h1>
          <p>Don't have an account? <span style={{cursor:"pointer",color:'grey'}} onClick={()=>navigate('/signup')}>Register</span></p>
        </div>
        <div>
        <div className='userdet'>
          <div className='user1'>
            <label>Email</label>
            <input type="email" value={email} placeholder='Enter your email address' onChange={(e)=>setEmail(e.target.value)}/>
          </div>
          <div className='user1'>
            <label>Password</label>
            <input type="password" value={password} placeholder='Enter password' onChange={(e)=>setPassword(e.target.value)}/>
          </div>
        </div>
        {error && <div>
          <p style={{textAlign:'center',width:'70%',color:'red',paddingTop:"10px"}}>{error}</p>
        </div>}
        <div className='registernow loginbtn' style={{alignItems:'start',textAlign:'start'}}>
          {isLoading ? 
          <button className="buttonload signup-button">
            <i className="fa fa-spinner fa-spin"></i>
          </button>
          :
          <button onClick={handleLogin}>Login</button>}
        </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Signin
