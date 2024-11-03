import React, { useEffect, useState } from 'react'
import './signup.css'
import logo from '../images/logo.png'
import Bitmojees from '../bitmoji/Bitmojees'
import ApiService from '../../service/ApiService'
import { useNavigate } from 'react-router-dom'
import DynamicPage from '../Commons/DynamicPage'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowUpRight } from 'lucide-react'
import 'font-awesome/css/font-awesome.min.css';
import CryptoJS from 'crypto-js'

const Register = () => {
  const [profilepicture,setProfile]= useState('')
  const [role,setUserType]= useState('')
  const [firstname,setFirstname] = useState('')
  const [midname,setMidname] = useState('')
  const [lastname,setLastname] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [confirmpass,setConfirmpass] = useState('')
  const [phoneNumber,setPhonenumber] = useState('')
  const [isaccept,setIsAccept] = useState(false)
  const [dob,setDob] = useState()
  const [indes,setIndes] = useState()
  const [gender,setGender] = useState('')
  const [error,setError] = useState('')
  const [isLoading,setLoading] = useState(false)
  const [feedbacks,setFeedbacks] = useState()
  const printUrl = (value,index)=>{
    setProfile(value)
    setIndes(index)
  }
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

  const handleRegister=async()=>{
    setLoading(true)
    try{
        
      const response = await ApiService.registerUser({firstname,midname,lastname,email,phoneNumber,password,isaccept,profilepicture,role,dob,gender},confirmpass)
      setLoading(false)
      navigate(`/otp/${encryptId(response.userDTO.id)}`)

    }
    catch(err){
      setLoading(false)
      setError(err.response?.data?.message || err.message || "An error occured")
    }
  }

  return (
    <div>
    <DynamicPage title="Register" description="Signup page of Eventura"/>
    <div className='register' style={{minHeight:'100vh'}}>
      <div className='reg1'>
        <div className='logo'>
          <img src={logo} alt='E'/>
          <p onClick={()=>navigate('/')}>Go Home <span><ArrowUpRight className='arrow' size={15} /></span></p>
        </div>
        <div>
          <h1>Start your journey with us.</h1>
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

      <div className='reg2' style={{color:'black'}}>
        <div style={{paddingBottom:'20px'}}>
          <h1>Sign up</h1>
          <p>Have an account? <span style={{cursor:"pointer",color:'grey'}} onClick={()=>navigate('/login')}>Signin</span></p>
        </div>
        <div className='looking' style={{paddingBottom:'30px'}}>
          <p style={{color:'grey'}}>Looking for?</p>
          <div className='looks'>
          <label className='look1' style={{borderColor:role==='HOST'&&'#3b37ff',backgroundColor:role==='HOST'&&'#3a37ff18'}}>
          <input
          type="radio"
          name="role"
          value="HOST"
          checked={role === 'HOST'}
          onChange={(e)=>setUserType(e.target.value)}
          />
          Host Events
        </label >
        <label  className='look1' style={{borderColor:role==='USER'&&'#3b37ff',backgroundColor:role==='USER'&&'#3a37ff18'}}>
        <input
          type="radio"
          name="role"
          value="USER"
          checked={role === 'USER'}
          onChange={(e)=>setUserType(e.target.value)}
          />
          Explore Events
        </label></div>
        </div>
        <div>
        <div className='userdet'>
          <div className='user1 user2'>
            <div className='user3' style={{display:'flex',flexDirection:'column',alignItems:'start',gap:'1rem'}}>
              <label>First name</label>
              <input type='text' placeholder='first name' value={firstname} onChange={(e)=>setFirstname(e.target.value)}/>
            </div>
            <div className='user3' style={{display:'flex',flexDirection:'column',alignItems:'start',gap:'1rem'}}>
              <label>Middle name <span style={{color:'grey'}}>(optional)</span></label>
                <input type='text' placeholder='Middle name' value={midname} onChange={(e)=>setMidname(e.target.value)}/>
            </div>
            <div className='user3' style={{display:'flex',flexDirection:'column',alignItems:'start',gap:'1rem'}}>
              <label>Last name</label>
                <input type='text' placeholder='Last name' value={lastname} onChange={(e)=>setLastname(e.target.value)}/>
            </div>
          </div>
          <div className='user1'>
            <label>Email</label>
            <input type="email" value={email} placeholder='Enter your email address' onChange={(e)=>setEmail(e.target.value)}/>
          </div>

          <div className='user1'>
            <label>Phone Number</label>
            <input type="text" value={phoneNumber} placeholder='Enter Phonenumber' onChange={(e)=>setPhonenumber(e.target.value)}/>
          </div>

          <div className='user1'>
            <label>Password</label>
            <input type="password" value={password} placeholder='Enter password' onChange={(e)=>setPassword(e.target.value)}/>
          </div>

          <div className='user1'>
            <label>Confirm Password</label>
            <input type="password" value={confirmpass} placeholder='Enter password again' onChange={(e)=>setConfirmpass(e.target.value)}/>
          </div>

          <div className='user1'>
            <label style={{textAlign:'center',width:'70%'}}>Select an avatar</label>
            <Bitmojees printUrl={printUrl} indes={indes}/>
          </div>
          <div className='user1'>
            <select value={gender} onChange={(e)=>setGender(e.target.value)}>
              <option value="" disabled>Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className='user1'>
            <label>Date of birth</label>
            <input type='date' placeholder='Select your date of birth' value={dob} onChange={(e)=>setDob(e.target.value)}/>
            {/* <DatePicker
              selected={dob}
              onChange={(date) => setDob(date)}
              isClearable
              placeholderText="Choose DOB"
            /> */}
          </div>
          <div>
            <label>
              <input type='checkbox' checked={isaccept} onChange={(e)=>setIsAccept(e.target.checked)}/> Accept terms of services
            </label>
          </div>
        </div>
        {error && <div>
          <p style={{textAlign:'center',width:'70%',color:'red',paddingTop:"10px"}}>{error}</p>
        </div>}
        <div className='registernow'>
          {isLoading ? 
          <button className="buttonload signup-button">
            <i className="fa fa-spinner fa-spin"></i>
          </button>
          :
          <button onClick={handleRegister}>Register Now</button>}
        </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Register
