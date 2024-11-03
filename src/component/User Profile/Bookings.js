import React, { useEffect, useState } from 'react'
import { useUser } from '../Context/UserContext'
import ApiService from '../../service/ApiService'
import Loading from '../Commons/Loading'
import Barcode from 'react-barcode'
import './profile.css'
import { useNavigate } from 'react-router-dom'

const Bookings = () => {

  const {user} = useUser()
  const [event,setEvent] = useState()
  const [book,setBook] = useState()

  useEffect(()=>{

    const getUserBookings = async()=>{
      try{

        const response = await ApiService.getUserBooking(user&&user.id);
        console.log(response)
        setBook(response.bookList)
        setEvent(response.eventList)

      }
      catch(err){
        console.log(err)
      }
    }
    getUserBookings();

  },[user])

  const navigate = useNavigate()

  return (
    <div className='booking-user'>
      {event&&book?
        <div className='bookings'>
          {event.map((e,index)=>(
            <div className='book' onClick={()=>navigate(`/ticket/${book[index].id}`)}>
              <div>
                <img src={e.eventposter} height={150}/>
              </div>
              <div style={{width:"400px"}}>
                <h2 style={{fontSize:"20px"}}>{e.eventname}</h2>
                <p style={{color:'grey',fontSize:"13px"}}>{e.description.slice(0,100)}{e.description.length>100&&"..."}</p>
              </div>
              <div>
                <p style={{color:'grey',fontSize:'12px'}}>{e.startdate? e.startdate.split("T")[0] : e.starttime }</p>
              </div>
            </div>
          ))}
        </div> 
        :
        <Loading/> 
    }
    </div>
  )
}

export default Bookings
