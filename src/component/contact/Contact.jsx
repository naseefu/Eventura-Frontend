import React, { useEffect, useState } from 'react'
import './contact.css'
import Navbar from '../Commons/Navbar'
import ApiService from '../../service/ApiService'
import 'font-awesome/css/font-awesome.min.css';
import Footer from '../Commons/Footer';
import { useUser } from '../Context/UserContext';
import contact from '../images/grad5.jpg'
import { ArrowLeft, ArrowRight } from 'lucide-react';
import StarRating from './StarRating';
import DynamicPage from '../Commons/DynamicPage';

const Contact = () => {
  const {user} = useUser()
  const [firstname,setFirstname] = useState(user &&user.firstname || "")
  const [lastname,setLastname] = useState(user &&user.lastname || "")
  const [email,setEmail] = useState(user &&user.email || "")
  const [phone,setPhone] = useState()
  const [message,setMessage] = useState()
  const [success, setSuccess] = useState(false)
  const [error,setError] = useState(false)
  const [loading,setLoading] = useState(false)

  const handleContact = async()=>{
    setLoading(true)
    try{

      const response = await ApiService.sendContact({firstname,lastname,email,phone,message})
      setLoading(false)
      setSuccess("sended message succesully")

    }
    catch(err){
      setLoading(false)
      setError(err.response?.data?.message || "Server is down, contact later")
    }
  }

  useEffect(()=>{

    if(success || error){
      setTimeout(() => {
        setSuccess('')
        setError('')
      },5000)
    }

  },[success,error])

  const [feedbacks,setFeedbacks] = useState()

  const [i,setI] = useState(0)
  
  useEffect(()=>{
    const getFeeback=async()=>{
      try{
        const response = await ApiService.getSomeFeedback();
        setFeedbacks(response.websiteFeedbackDTOs)
      }
      catch(err){
        console.log(err)
      }
    }
    getFeeback()
  },[])

  return (
    <div className='contacts'>
      <div className='contactmain'>
      <Navbar/>
      <DynamicPage title="contact" description="contact page of eventura"/>
      <div className='contact'>
        <div className='contact-card2' style={{backgroundColor:'rgba(0, 0, 187, 0.015)'}}>
          <div>
            <h1>Get in Touch</h1>
            <p>You can reach us anytime</p>
          </div>
          {success && <p style={{textAlign:'center',color:"green",fontSize:'12px'}}>{success}</p>}
          {error && <p style={{textAlign:'center',color:"red",fontSize:'12px'}}>{error}</p>}
          <div>
            <input type='text' value={firstname} onChange={(e)=>setFirstname(e.target.value)} placeholder='First name'></input>
            <input type='text' value={lastname} onChange={(e)=>setLastname(e.target.value)} placeholder='Last name'></input>
          </div>
          <div>
            <input type='text' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Email'></input>
          </div>
          <div>
            <input type='number' value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder='Phone number'></input>
          </div>
          <div>
            <input style={{height:'120px'}} placeholder='How can we help?' value={message} onChange={(e)=>setMessage(e.target.value)} type='text-area' />
          </div>
          <div>
            {loading ? 
          <button className="buttonload">
            <i className="fa fa-spinner fa-spin"></i>
          </button>
          :
            <button onClick={handleContact}>submit</button>}
          </div>
        </div>
        <div className='contact-card1' style={{backgroundImage:`url(${contact})`,
        height:"100%",width:"100%",backgroundPosition:'center',
        backgroundSize:"cover",borderRadius:'20px'}}>
          {feedbacks && <div className='feedcard'>
            <div>
              <StarRating rating={feedbacks[i].star}/>
            </div>
            <div>
              <p>{feedbacks[i].feedback.slice(0,100)}{feedbacks[i].feedback.length>100&&"..."}</p>
            </div>
            <div className='feeduser' style={{display:"flex",alignItems:'center',justifyContent:'space-between',width:'100%'}}>
              <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                <img src={feedbacks[i].profilepicture} alt='E' style={{borderRadius:'40px',height:'35px'}}/>
                <h3 style={{fontSize:"14px"}}>{feedbacks[i].firstname} {feedbacks[i].lastname}</h3>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                <p style={{cursor:"pointer"}} onClick={()=>setI(i===0 ?feedbacks.length-1:(i-1)%feedbacks.length)}><ArrowLeft/></p>
                <p style={{cursor:"pointer"}} onClick={()=>setI((i+1)%feedbacks.length)}><ArrowRight/></p>
              </div>
            </div>
        </div>}
        </div>
        
      </div></div>
      <div style={{padding:'50px 30px',display:'grid',gridTemplateColumns:"1fr 1fr 1fr",gap:'2rem',alignItems:'center',justifyContent:'start',backgroundColor:'black',color:'white'}}>
        <div className='contmap'>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31431.079547984344!2d76.29152174643305!3d10.02635246512979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080da53444d5e9%3A0xb46c57c6b1bc9aff!2sEdappally%2C%20Kochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1729858244615!5m2!1sen!2sin" width="600" height="450" style={{border:'none',borderRadius:"20px"}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
          <div style={{margin:'0 auto'}}>
          <p style={{fontSize:'15px'}}>Our Location</p>
          <h1 style={{marginBottom:'25px',fontSize:'30px'}}>Connecting Near and Far</h1>
          <div style={{color:'grey',fontSize:'12px'}}>
          <h3 style={{color:'black'}}>Headquarters</h3>
          <p>Eventura Inc</p>
          <p>Edappally</p>
          <p>Kochi, Kerala</p></div>
        </div>
        <div className='collegues' style={{position:'relative'}}>
          <img height="250px" style={{position:'absolute',top:'0%',left:'50%',transform:'translate(-40%,-80%)',zIndex:"9999"}} src='https://images.pexels.com/photos/7988667/pexels-photo-7988667.jpeg?auto=compress&cs=tinysrgb&w=600'/>
          <img height="300px" style={{position:'absolute',left:'50%',transform:'translate(-50%,-20%)'}} src='https://images.pexels.com/photos/5256816/pexels-photo-5256816.jpeg?auto=compress&cs=tinysrgb&w=600'/>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Contact
