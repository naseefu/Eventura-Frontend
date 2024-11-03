import React, { useEffect, useState } from 'react'
import { useUser } from '../Context/UserContext'
import ApiService from '../../service/ApiService'
import './profile.css'
import { useNavigate } from 'react-router-dom'

const YourEvents = () => {

  const {user} = useUser()
  const [eventList,setEventList] = useState()
  useEffect(()=>{

    if(user){
    const getHostEvents=async()=>{
      try{

        const response = await ApiService.getHostedEvents(user.id)
        console.log(response)
        setEventList(response.eventList)

      }
      catch(err){

      }
    }
    getHostEvents();
  }

  },[user])

  const navigate = useNavigate()

  return (
    <div className='host'>
      {eventList&&eventList.length>0? <div className='hostedevents' style={{display:'flex',flexDirection:'column',gap:'1.5rem',padding:"20px 10px 40px 10px"}}>
        {eventList.map((event,index)=>(
          <div key={index} className='hostevent' onClick={()=>navigate(`${event.eventname}/user-bookings/${user && user.id}/${event.id}`)}>
            <div className='hostevent1'>
            <div>
              <img style={{objectFit:'cover'}} src={event.eventposter} height='150px' width="250px" alt='event'/>
            </div>
            <div>
              <h1>{event.eventname}</h1>
              <p>{event.category}</p>
            </div>
            </div>
            <div className='hostevent2'>
              <p>${event.price}</p>
              <button>Cancel Event</button>
            </div>
          </div>
        ))}

      </div>
      
      
      :
      
      <div>
        <p>You have no events hosted, <span>Host Now</span></p>  
      </div>}
    </div>
  )
}

export default YourEvents
