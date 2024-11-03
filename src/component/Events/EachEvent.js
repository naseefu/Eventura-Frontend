import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import Loading from '../Commons/Loading';
import './eachevent.css'
import Navbar from '../Commons/Navbar';
import { AlarmClock, ArrowRight, ArrowUpRight, CalendarDays, EthernetPort, GitCommitHorizontal, MapPin, PersonStanding, Shapes, Timer } from 'lucide-react';
import MapComponent from '../Home/MapComponent';
import logo from '../images/logo.png'
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import DynamicPage from '../Commons/DynamicPage';
import { useUser } from '../Context/UserContext';

const EachEvent = () => {
  const { id } = useParams();
  const {user} = useUser()
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [recom,setRecomm] = useState([])
  useEffect(() => {
    const getEachEvent = async () => {
      setLoading(true);
      try {
        const response = await ApiService.getEachEvent(id);
        setEvent(response.eventDTO);
        console.log(response.eventDTO)
      } catch (err) {
        setError(err.response?.data?.message || "An error occured");
      } finally {
        setLoading(false);
      }
    };
    getEachEvent();
  }, [id]);

  useEffect(()=>{

    const getRecommEvent = async () => {
      try {
        const response = await ApiService.getRecommendation(event.category,event.id);
        setRecomm(response.eventList);
      } catch (err) {
        setError(err.response?.data?.message || "An error occured");
      } finally {
        setLoading(false);
      }
    };
    if(event){
      getRecommEvent()
    }
  },[event])

  const fetchAllTags = (tags)=>{
    return tags.split(',')
  }
  const fetchAllAbout = (about)=>{
    return about.split('.')
  }

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


  const calculateTimeDifference=(startDateTime,endDateTime)=>{
    const days = differenceInDays(endDateTime, startDateTime);
    const hours = differenceInHours(endDateTime, startDateTime) % 24; // Remaining hours after days
    const minutes = differenceInMinutes(endDateTime, startDateTime) % 60; // Remaining minutes after hours
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
  const navigate = useNavigate()
  return (
    <div >
      {loading ? (
        <Loading />
      ) : error ? (
        <div>
          <h1>{error}</h1>
        </div>
      ) : event ? ( 
        <div className='maineach' >
          <DynamicPage title={event.eventname} description={event.description.slice(0,30)}/>
        <div className='eachevent' style={{borderRadius:'',backgroundImage:`url(${event.eventposter})`}}>
          {/* <Navbar/> */}
        <div className='eacheventmain' style={{height:"80%",width:'90%',margin:'0 auto',display:'flex',padding:"40px",alignItems:'stretch',borderRadius:"20px"}}>
          <div className='card1'  style={{width:"40vw",backgroundColor:'transparent',borderLeft:"6px solid yellow",borderRight:"1px solid violet",paddingBottom:"50px"}}>
            <div className='logo'>
              <img src={logo}/>
            </div>
            <div className='title'>
              <h1 style={{width:'80%'}}>{event.eventname}</h1>
              <p>{event.location}</p>
            </div>
            <div className='underline'></div>
            <div className='overview'>
              <h3>overview</h3>
              <p>{event.description}</p>
              <h1>₹{event.price}</h1>
              {event.canceled ? <p style={{color:'red',borderRadius:'20px',fontSize:"12px",backgroundColor:'white',width:'fit-content',padding:'5px 10px'}}>Cancelled</p> : 
              event.eventtype==="Everyday"? user && event.hostedBy!=user.id ?<button className='joinbtn' onClick={()=>navigate(`/payment/${event.id}`)}>Join Now<span><ArrowRight size={10}/></span></button >:<button className='joinbtn'>Cancel Event<span><ArrowRight size={10}/></span></button>:
              user && event.hostedBy!=user.id ?<button className='joinbtn' onClick={()=>navigate(`/payment/${event.id}`)}>Book Now <span><ArrowRight size={10}/></span></button>:
              <button className='joinbtn'>Cancel Event<span><ArrowRight size={10}/></span></button>}
            </div>
          </div>
          <div className='eachevent2' style={{width:"45vw",maxWidth:"45vw",borderRadius:'20px',position:"relative"}}>
            <p className='gohome' onClick={()=>navigate('/')}>Go Home<span><ArrowUpRight className='arrow' size={20}/></span></p>
            <div className='desc' style={{display:event.message?'grid':'flex',gridTemplateColumns:'1fr 1.1fr',gap:"2rem",alignItems:'start',justifyContent:'start'}}>
              <div className='about'>
              {fetchAllAbout(event.about).map((ab, index) => (
               ab.trim() && <p className='about-p' style={{fontFamily:'serif',display:'flex',alignItems:'start',gap:'1rem'}} key={index}>{ab.trim()}</p> // Use index as key or a unique identifier if available
              ))}
              </div>
              {event.message &&<div className='message'>
                <p>"{event.message}"</p>
              </div>}
            </div>
            <div style={{padding:'20px'}}>
              <table style={{ color: 'white'}}>
              <tbody>
                <tr >
                  <td><p><span><MapPin size={15}/></span>{event.location}</p></td>
                  {event.eventtype==="Everyday"?<td><p><span><Timer size={15}/></span>Everyday at {formatLocalTime(event.starttime)}</p></td>:<td><p><span><CalendarDays size={15}/></span>{formatLocalDateTime(event.startdate)[4]} {formatLocalDateTime(event.startdate)[1]},{formatLocalDateTime(event.startdate)[2]} {formatLocalDateTime(event.startdate)[3]}</p></td>}
                  {duration && <td ><p><span><AlarmClock size={15}/></span>{duration[0]>0 && `${duration[0]} days`} {duration[1]>0 && `${duration[1]} hour`} {duration[2]>0 && `${duration[2]} minutes`}</p></td>}
                </tr>
                <tr>
                  <td><p><span><EthernetPort size={15} /></span>{event.eventmethod}</p></td>
                  <td><p><span><Shapes size={15}/></span>{event.category}</p></td>
                  <td><p><span><PersonStanding size={15}/></span>{event.capacity}</p></td>
                </tr>
              </tbody>
              </table>

            </div>
            {recom.length>0 && <div className='recommendations'>
            <h2>More {event.category}s</h2>
            <div className='rec-event'>
            {recom!=null && recom.map((r, index) => (
              <div key={index} className='recommendation' onClick={()=>navigate(`/event/${r.id}`)} style={{ backgroundImage: `url(${r.eventposter})` }}>
              <p>{r.eventname}</p>
              </div>
            ))}
            </div></div>}

          </div>
        </div>
        </div></div>
      ) : (
        <div>
          <h1>No such event</h1>
        </div>
      )}
    </div>
  );
};

export default EachEvent;



// {fetchAllAbout(event.about).map((ab, index) => (
//                 <p style={{fontFamily:'serif',display:'flex',alignItems:'start',gap:'1rem'}} key={index}>{ab.trim() &&<ArrowRight size={50}/>} {ab.trim()}</p> // Use index as key or a unique identifier if available
//               ))} </div> 
//           </div> 
//           <div style={{margin:'0',padding:'0'}}>
//             <div>
//               <h3 style={{fontWeight:'lighter'}}>Event Capacity</h3>
//               <p>{event.capacity}</p>
//             </div>
//             <div className='location'>
//               <h3 style={{fontFamily:'sans-serif',fontWeight:'lighter',margin:'0'}}>Event Location</h3>
//               <MapComponent placeName={event.location}/>
//             </div> 
//             <h3 style={{fontWeight:'lighter'}}>Event Tags</h3>
//               <div className='tags' style={{display:'flex'}}>
//               {fetchAllTags(event.tags).map((tag, index) => (
//                 <p key={index}>#{tag.trim()}</p> // Use index as key or a unique identifier if available
//               ))}  