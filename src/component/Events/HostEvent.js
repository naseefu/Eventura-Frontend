import React, { useEffect, useState } from 'react'
import { useUser } from '../Context/UserContext'
import Navbar from '../Commons/Navbar';
import './eventhost.css'
import logo from '../images/logo1.png'
import logo1 from '../images/logo.png'
import { ArrowLeft, Calendar, CircleFadingArrowUp, MessageCircleCode, MoveLeft, UserRoundX } from 'lucide-react';
import ApiService from '../../service/ApiService';
import { useNavigate } from 'react-router-dom'
import 'font-awesome/css/font-awesome.min.css';


const HostEvent = () => {

  const {user} = useUser();
  const [loading,setLoading] = useState(false)
  const [eventname,setName] = useState("")
  const [category,setcategory] = useState("")
  const [location,setLocation] = useState("")
  const [description,setDescription] = useState("")
  const [eventmethod,setEventMethod] = useState("")
  const [capacity,setCapacity] = useState("")
  const [about,setAbout] = useState("")
  const [initialprice,setInitial] = useState()
  const [price,setPrice] = useState()
  const [eventtype,setType] = useState("")
  const [startdate,setStartdate] = useState("")
  const [enddate,setEnddate] = useState("")
  const [starttime,setStarttime] = useState("")
  const [endtime,setEndtime] = useState("")
  const [eventposter,setEventPoster] = useState("")
  const [tag,setTag] = useState("")
  const [message,setMessage] = useState("")
  const [errorf,setErrorf] = useState();
  const [error1,setError1] = useState();
  const [error2,setError2] = useState();
  const [error3,setError3] = useState();
  const [error4,setError4] = useState();
  const [succes,setSucces] = useState()
  const [i,setI] = useState(1)

  // const navigate = useNavigate()

  const handleFinish= async()=>{

    setLoading(true)

    try{

      const response = await ApiService.hostEvent(user&&user.id,{eventname,category,location,description,eventmethod,capacity,about,
        initialprice,price,eventtype,startdate,enddate,starttime,endtime,eventposter,tag,message});
        setLoading(false)
      navigate('/profile/your-events')
      setSucces(response.message)

    }
    catch(err){
      setLoading(false)
      setErrorf(err.response?.data?.message || "An error occured")
    }

  }

  useEffect(()=>{

    setTimeout(()=>{
      if(errorf || error1 || error2 || error3 || error4){

      setErrorf('');
      setError1('');
      setError2('');
      setError3('');
      setError4('');

    }
    },3000)

  },[errorf,error1,error2,error3,error4])



  const handleNext =(i)=>{

    if(i===1){

      if(eventname==="" || category==="" || location==="" || description===""){
        setError1('Please fill all the fields')
        setI(1)
      }
      else{
        setI(2)
      }

    }
    else if(i==2){

      if(eventmethod==="" || capacity==="" || about==="" ){
        setError2('Please fill all the fields')
        setI(2)
      }
      else{
        setI(3)
      }

    }
    else if(i==3){

      if(!initialprice || !price ||eventtype===""){
        setError3('Please fill all the fields')
        setI(3)
      }
      else{
        if(eventtype==="Specific"){
          if(startdate==="" || enddate===""){
            setError3('Please fill all the fields')
            setI(3)
          }
          else{
            setI(4)
          }
        }
        else if(eventtype==="Everyday"){
          if(starttime==="" || endtime===""){
            setError3('Please fill all the fields')
            setI(3)
          }
          else{
            setI(4)
          }
        }
      }

    }

  }

  const navigate = useNavigate()

  return (
    <div className='event-host-main'>
      <div className='event-host'>
        <div className='event-hosts'>
          <div className='event-host1'>
          <div style={{paddingBottom:"40px"}}>
            <img src={logo} height={35}/>
          </div>
          <div className='eventsteps'>
            <div className='underline'></div>
          <div>
          <div className='steps' style={{color:i===1&&'black'}}>
            <p className='logo'><CircleFadingArrowUp height={18} style={{marginTop:"2px"}}/></p>
            <div>
              <p className='p1'>Event Basics</p>
              <p className='p2'>Let’s get started with the essentials!</p>  
            </div>
          </div>
          <div className='steps' style={{color:i===2&&'black'}}>
            <p className='logo'><Calendar height={18} style={{marginTop:"2px"}}/></p>
            <div>
              <p className='p1'>Event Details</p>
              <p className='p2'>Add the finer details to make your event shine.</p>
            </div>
          </div>
          <div className='steps' style={{color:i===3&&'black'}}>
            <p className='logo'><UserRoundX height={18} style={{marginTop:"2px"}}/></p>
            <div>
              <p className='p1'>Pricing & Availability</p>
              <p className='p2'>Set your pricing and schedule so attendees know when to join!</p>
            </div>
          </div>
          <div className='steps' style={{color:i===4&&'black'}}>
            <p className='logo'><MessageCircleCode height={18} style={{marginTop:"2px"}}/></p>
            <div>
              <p className='p1'>Reviw & Publish</p>
              <p className='p2'>You're almost there! Review your event and get ready to go live.</p>
            </div>
            </div>
          </div>
          </div>
          </div>
          <div>
            <div>
              <p onClick={()=>navigate("/")} className='backhome' style={{display:'flex',borderRadius:'20px',width:'fit-content',alignItems:'center',padding:'5px 10px',gap:'1rem',fontSize:"12px",cursor:"pointer"}}><span style={{marginTop:"3px"}}><MoveLeft width={18}/></span> Back to home</p>
            </div>
          </div>
        </div>
        <div className='event-host2'>
          {i===1&&
          <div className='main-input'>

              <div style={{textAlign:'center'}}>
                <img src={logo} height={35}/>
                <h1>Event Basics</h1>
                <p style={{fontSize:"12px",color:"grey",margin:'5px 0'}}>Let’s get started with the essentials!</p>  
              </div>
              <div>
                <div className='inputs'>
                  <label>Event name</label>
                  <input placeholder='Event name' value={eventname} onChange={(e)=>setName(e.target.value)}></input>
                </div>
                <div className='inputs'>
                  <label>Category</label>
                  <input placeholder='Concert, Workshop, Seminar,...' value={category} onChange={(e)=>setcategory(e.target.value)}></input>
                </div>
                <div className='inputs'>
                  <label>Location</label>
                  <input placeholder='Location name' value={location} onChange={(e)=>setLocation(e.target.value)}></input>
                </div>
                <div className='inputs'>
                  <label>Event Description</label>
                  <input style={{marginBottom:"0"}} placeholder='Event Description' value={description} onChange={(e)=>setDescription(e.target.value)}></input>
                </div>
              </div>
              {error1 && <p style={{color:'red',fontSize:'12px'}}>{error1}</p>}
              <div className='buttons'>
                <button className='next' style={{width:"25vw",cursor:"pointer",padding:"10px",color:'white',borderRadius:"10px",border:'none'}} onClick={()=>handleNext(1)}>Next</button>
              </div>

          </div>}

          {i===2&&
          <div className='main-input'>

              <div style={{textAlign:'center'}}>
                <img src={logo} height={35}/>
                <h1>Event Details</h1>
                <p style={{fontSize:"12px",color:"grey",margin:'5px 0'}}>Add the finer details to make your event shine</p>  
              </div>
              <div>
                <div className='inputs'>
                  <label>Event Method</label>
                  <select style={{height:"35px",border:'1px solid rgb(230, 230, 230)',paddingLeft:"10px",borderRadius:"5px"}} value={eventmethod} onChange={(e)=>setEventMethod(e.target.value)}>
                    <option value="">Select an option</option>
                    <option value="offline">Offline</option>
                    <option value="online">Online</option>
                  </select>
                </div>
                <div className='inputs'>
                  <label>Capacity</label>
                  <input placeholder='Enter the capacity of event' value={capacity} onChange={(e)=>setCapacity(e.target.value)}></input>
                </div>
                <div className='inputs'>
                  <label>About</label>
                  <input placeholder='About event' value={about} onChange={(e)=>setAbout(e.target.value)}></input>
                </div>
                <div className='inputs'>
                  <label>Tags <span style={{color:"grey"}}>(optional)</span></label>
                  <input style={{marginBottom:"0"}} placeholder='Concert, music, teaching,...' value={tag} onChange={(e)=>setTag(e.target.value)}></input>
                </div>
              </div>
              {error2 && <p style={{color:'red',fontSize:'12px'}}>{error2}</p>}
              <div className='buttons' style={{display:'flex',gap:'1rem'}}>
                <button className='next back' style={{width:"12vw",cursor:"pointer",padding:"10px",color:'white',borderRadius:"10px",border:'none'}} onClick={()=>setI(1)}>Previous</button>
                <button className='next' style={{width:"12vw",cursor:"pointer",padding:"10px",color:'white',borderRadius:"10px",border:'none'}} onClick={()=>handleNext(2)}>Next</button>
              </div>

          </div>}

          {i===3&&
          <div className='main-input'>

              <div style={{textAlign:'center'}}>
                <img src={logo} height={35}/>
                <h1>Pricing & Availability</h1>
                <p style={{fontSize:"12px",color:"grey",margin:'5px 0'}}>Set your pricing and schedule so attendees know when to join!</p>  
              </div>
              <div>
                <div className='inputs'>
                  <label>Initial Price</label>
                  <input placeholder='Initial Price' type='number' value={initialprice} onChange={(e)=>setInitial(e.target.value)}></input>
                </div>
                <div className='inputs'>
                  <label>Final Price</label>
                  <input placeholder='Final Price' type='number' value={price} onChange={(e)=>setPrice(e.target.value)}></input>
                </div>
                <div className='inputs'>
                  <label>Event Type</label>
                  <select style={{height:"35px",border:'1px solid rgb(230, 230, 230)',paddingLeft:"10px",borderRadius:"5px"}} value={eventtype} onChange={(e)=>setType(e.target.value)}>
                    <option value="" disabled>Select one option</option>
                    <option value="Specific">Specific</option>
                    <option value="Everyday">Everyday</option>
                  </select>
                </div>


                {eventtype==="Specific"&& <div><div className='inputs'>
                  <label>Start Date</label>
                  <input style={{marginBottom:"0"}} placeholder='Start date' type='datetime-local' value={startdate} onChange={(e)=>setStartdate(e.target.value)}></input>
                </div>
                <div className='inputs'>
                  <label>End Date</label>
                  <input style={{marginBottom:"0"}} placeholder='End date' type='datetime-local' value={enddate} onChange={(e)=>setEnddate(e.target.value)}></input>
                </div></div>}


                {eventtype==="Everyday"&& <div><div className='inputs'>
                  <label>Start Time</label>
                  <input style={{marginBottom:"0"}} placeholder='Start date' type='time' value={starttime} onChange={(e)=>setStarttime(e.target.value)}></input>
                </div>
                <div className='inputs'>
                  <label>End Time</label>
                  <input style={{marginBottom:"0"}} placeholder='End date' type='time' value={endtime} onChange={(e)=>setEndtime(e.target.value)}></input>
                </div></div>}


              </div>
              {error3 && <p style={{color:'red',fontSize:'12px'}}>{error3}</p>}
              <div className='buttons' style={{display:'flex',gap:'1rem'}}>
                <button className='next back' style={{width:"12vw",cursor:"pointer",padding:"10px",color:'white',borderRadius:"10px",border:'none'}} onClick={()=>setI(2)}>Previous</button>
                <button className='next' style={{width:"12vw",cursor:"pointer",padding:"10px",color:'white',borderRadius:"10px",border:'none'}} onClick={()=>handleNext(3)}>Next</button>
              </div>

          </div>}


          {i===4&&
          <div className='main-input'>

              <div style={{textAlign:'center'}}>
                <img src={logo} height={35}/>
                <h1>Review & Publish</h1>
                <p style={{fontSize:"12px",color:"grey",margin:'5px 0'}}>Add the finer details to make your event shine</p>  
              </div>
              <div>
                <div className='inputs'>
                  <label>Event Poster</label>
                  <input placeholder='Event Poster' value={eventposter} onChange={(e)=>setEventPoster(e.target.value)}></input>
                </div>
                <div className='inputs'>
                  <label>Message</label>
                  <input placeholder='Personalized message to display the attendees' value={message} onChange={(e)=>setMessage(e.target.value)}></input>
                </div>
              </div>
              {errorf && <p style={{color:'red',fontSize:'12px'}}>{errorf}</p>}
              <div className='buttons' style={{display:'flex',gap:'1rem'}}>
                <button className='next back' style={{width:"12vw",cursor:"pointer",padding:"10px",color:'white',borderRadius:"10px",border:'none'}} onClick={()=>setI(3)}>Previous</button>
                {loading ? 
                <button className="buttonload next finish">
                  <i className="fa fa-spinner fa-spin"></i>
                </button>
                :
                <button className='next finish' style={{width:"12vw",cursor:"pointer",padding:"10px",color:'white',borderRadius:"10px",border:'none'}} onClick={handleFinish}>Finish Now</button>}
              </div>

          </div>}

        </div>
      </div>
    </div>
  )
}

export default HostEvent
