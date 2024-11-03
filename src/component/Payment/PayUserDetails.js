import React, { useEffect, useRef, useState } from 'react'
import './pay.css'
import { useUser } from '../Context/UserContext'
import Loading from '../Commons/Loading'
import ApiService from '../../service/ApiService'
import { useNavigate, useParams } from 'react-router-dom'
import { AlarmClock, CalendarDays, Lock, Timer } from 'lucide-react'
import Navbar from '../Commons/Navbar'
import img from '../images/grad3.jpg'

import 'font-awesome/css/font-awesome.min.css';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns'
import logo from '../images/logo.png'
import axios from 'axios'
const PayUserDetails = () => {

  const navigate = useNavigate()
  const {user} = useUser()
  const {id} = useParams()
  const [event,setEvent] = useState()

  useEffect(()=>{

    const fetchEventDetails = async()=>{
      try{
        const response = await ApiService.getEachEvent(id)
        setEvent(response.eventDTO)
      }
      catch(err){
        navigate("/not-found")
      }
    }
    fetchEventDetails()

  },[id])

  const [seatCount,setSeatCount] = useState("1")

  const totalprice = event&& (event.price *(5/100) + event.price)*seatCount

  
    const formatLocalDateTime = (localDateTime) => {
    const date = new Date(localDateTime);
    const year = date.getFullYear();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[date.getMonth()];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayNames[date.getDay()];
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0'); 
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12; 
    hours = hours ? hours : 12;
    const time = `${hours}.${minutes}${ampm}`;

    return [year,monthName, dayName, time,date.getDate()];
  };
  const formatLocalTime = (localTime) => {
    const [hours, minutes, seconds] = localTime.split(':');
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }

    const ampm = date.getHours() >= 12 ? 'pm' : 'am';
    const formattedHours = (date.getHours() % 12) || 12; 
    const formattedMinutes = date.getMinutes().toString().padStart(2, '0'); 

    const time = `${formattedHours}:${formattedMinutes} ${ampm}`; // Format time
    return time; // Return the formatted time
};
  const [duration,setDuration] = useState()


  useEffect(()=>{
    if(event && event.eventtype=="Everyday"){
      if(event.starttime){
      setDuration(calculateTime(event.starttime,event.endtime))}
      else if(event.startdate){
        setDuration(calculateTimeDifference(event.startdate,event.enddate))
      }
    }
    if(event && event.eventtype==="Specific"){
      setDuration(calculateTimeDifference(event.startdate,event.enddate))
    }
  },[event])

  const calculateTimeDifference=(startDateTime,endDateTime)=>{
    const days = differenceInDays(endDateTime, startDateTime);
    const hours = differenceInHours(endDateTime, startDateTime) % 24;
    const minutes = differenceInMinutes(endDateTime, startDateTime) % 60;
    const seconds = differenceInSeconds(endDateTime, startDateTime) % 60;
    return [days,hours,minutes]
  }

  const calculateTime=(startTime,endTime)=>{
    const startDateTime = new Date(`1970-01-01T${startTime}`);
    let endDateTime = new Date(`1970-01-01T${endTime}`);
    const timeDifference = endDateTime.getTime() - startDateTime.getTime();
    const days=0;
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    return [days,hours,minutes]
  }

  const [make,setMake] = useState("Make Payment")
  const [error,setError] = useState('')
  
  const [orderIds,setOrderId] = useState()
  const [success,setSucces] = useState('')

  const orderIdRef = useRef();

  const handlePayment = async () => {
      setLoading(true)
      try{
        const response = await ApiService.createOrder(user && user.id,event&& event.id,seatCount);
        const { id: orderId, currency, amount: amount } = response;
        // console.log(response.orderId)
        // setOrderId(response.orderId)
        orderIdRef.current = response.orderId;
        const options = {
            key: "rzp_test_lKIBOvMMdpirDK",
            amount: amount,
            currency: currency,
            name: "Event Booking",
            image:img,
            description: "Book your event"+ event.eventname,
            id: id,
            handler: async (response)=>{
                try {
                  // console.log(orderIdRef.current)
                    const finishResponse = await ApiService.finishOrder(
                        user?.id,
                        event?.id,
                        orderIdRef.current,
                        response.razorpay_payment_id
                    );
                    setSucces("Booking success");
                    setLoading(false);
                } catch (err) {
                    setError(err.response?.data?.message || "An error occurred");
                    setLoading(false);
                }
                
            },
            prefill: {
                name: `${user?.firstname || ""} ${user?.midname || ""} ${user?.lastname || ""}`,
                email: user?.email || "",
                contact: user?.phonenumber || "",
            },
            notes: {
                address: event.location || "",
            },
            theme: {
                color: "#3399cc",
            },
            modal: {
            onDismiss: async () => {
                    try {
                        // console.log(orderIdRef.current)
                        await ApiService.cancelOrder(user?.id, event?.id, orderIdRef.current);
                        setError('Error during booking')
                        setLoading(false);
                    } catch (err) {
                        console.log("Error canceling order:", err);
                        setLoading(false);
                    }
                },
        },
      }

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      
      }

        catch(err){
          setLoading(false)
          setError(err.response?.data?.message || "An error occured")
          console.log(err);
        }
    };
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
      
      setTimeout(()=>{
        if(error || success){
        setError('')
        setSucces('')
      }
      },5000)

    },[error,success])

  return (
    <div>
      <Navbar/>
      {user&&event?<div className='pay-user'>
      
        <div className='userdetails' style={{padding:"0 30px"}}>

          <div>
            <h3 style={{fontSize:'14px'}}>Customer Information</h3>
            <div style={{fontSize:'13px',padding:"10px 0 20px 0",borderBottom:"1px solid rgba(230,230,230,1)"}}>
            <div>
              <p>{user.firstname} {user.midname&&user.midname} {user.lastname}</p>
            </div>
            <div>
              <p>{user.phonenumber}</p>
              <p>{user.email}</p>
            </div>
            </div>
          </div>
          <div style={{paddingTop:"30px"}}>
            <h3 style={{fontSize:'14px'}}>Event Information</h3>
            <div style={{fontSize:'13px',padding:"10px 0 20px 0",borderBottom:"1px solid rgba(230,230,230,1)"}}>
            <div>
              <p>{event.eventname}</p>
            </div>
            <div>
              <p>{event.category}</p>
            </div>
            <div style={{display:'flex',gap:'2rem'}}>
              {event.eventtype==="Everyday"?<p style={{display:'flex',alignItems:'center',gap:'0.5rem'}}><span style={{fontSize:'20px',color:'green'}}><Timer size={18}/></span>Everyday at {formatLocalTime(event.starttime)}</p>:<p style={{display:'flex',alignItems:'center',gap:'0.5rem'}}><span style={{fontSize:'20px',color:'green'}}><CalendarDays size={18}/></span>{formatLocalDateTime(event.startdate)[4]} {formatLocalDateTime(event.startdate)[1]},{formatLocalDateTime(event.startdate)[2]} {formatLocalDateTime(event.startdate)[3]}</p>}
              {duration && <p style={{display:'flex',alignItems:'center',gap:'0.5rem'}}><span style={{fontSize:'20px',color:'green'}}><AlarmClock size={18}/></span>{duration[0]>0 && `${duration[0]} days`} {duration[1]>0 && `${duration[1]} hour`} {duration[2]>0 && `${duration[2]} minutes`}</p>}
            </div>
            </div>
          </div>
          <div style={{paddingTop:'40px',paddingBottom:"20px"}}>
            <h3 for="ticket-quantity" style={{fontSize:'14px',paddingBottom:"20px"}}>How many seats would you like to book?</h3>
            <select id="ticket-quantity" value={seatCount} onChange={(e)=>setSeatCount(e.target.value)} className='ticketquantity' name="ticketQuantity">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          {error && <p style={{color:'red',fontSize:"12px"}}>{error}</p>}
          {success && <p style={{color:'green',fontSize:"12px"}}>{success}</p>}
          <div style={{paddingTop:"30px"}}>
            {loading ? 
          <button className="buttonload paymentbtn">
            <i className="fa fa-spinner fa-spin"></i>
          </button>
          :
            <button onClick={handlePayment} className='paymentbtn' onMouseLeave={()=>setMake("Make Payment")} onMouseEnter={()=>setMake("Click to Pay")}>{make}</button>}
          </div>
        </div>
        <div className='payment-part' style={{paddingBottom:"30px"}}>
            <div style={{textAlign:'center',borderBottom:"1px solid rgb(230, 230, 230)",padding:"20px 0"}}>
              <p>Total Amount</p>
              <h1 style={{fontFamily:"sans-serif",margin:'10px 0',color:'blue'}}>₹{String(totalprice).split(".")[0]}<span style={{color:'rgba(0, 0, 255, 0.274)'}}>.{String(totalprice).split(".")[1]?String(totalprice).split(".")[1]:"00"}</span></h1>
              <p style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.1rem',fontSize:'13px',color:'grey'}}><span style={{fontSize:"20px",color:'green'}}><Lock height={14}/></span> Secure Payment</p>
            </div>
            <div style={{padding:"20px 0"}}>
            <div style={{borderBottom:"1px solid rgb(230, 230, 230)",padding:"20px 0"}}>
              <p style={{color:'grey',fontSize:'13px'}}>Booking Summary</p>
              <div className='prices' style={{fontSize:"12px",fontFamily:'mainfont,sans-serif'}}>
                <h3>{event.eventname}</h3>
                <h3>₹{event.price}</h3>
              </div>
            </div>
              <div style={{borderBottom:"1px solid rgb(230, 230, 230)",padding:"20px 0",color:'grey',fontSize:'12px'}}>
                <div className='prices'>
                  <p>Subtotal x {seatCount}</p>
                  <p>₹{event.price*seatCount}</p>
                </div>
                <div className='prices'>
                  <p>GST (5%)</p>
                  <p>₹{totalprice-event.price*seatCount}</p>
                </div>
              </div>
              <div className='prices' style={{fontSize:"12px",padding:"20px 0",fontFamily:'mainfont,sans-serif'}}>
                <h3 className='prices'>Total</h3>
                <h3>₹{totalprice}</h3>
              </div>
            </div>
            <div style={{height:"fit-content",margin:"0",display:'flex',alignItems:'center',justifyContent:'center'}}>

              <img src={"https://cdn.pixabay.com/photo/2016/02/20/00/24/credit-card-1211409_640.png"} style={{borderRadius:'10px',height:"200px"}} alt='payment'/>

            </div>
          
        </div>

      </div>:
      
      <Loading/>}
    </div>
  )
}

export default PayUserDetails
