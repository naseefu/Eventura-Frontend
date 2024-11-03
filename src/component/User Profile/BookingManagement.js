import React, { useEffect, useState } from 'react'
import './userbooks.css'
import { useParams } from 'react-router-dom'
import ApiService from '../../service/ApiService'
import Loading from '../Commons/Loading'
import 'font-awesome/css/font-awesome.min.css';

const BookingManagement = () =>{

  const {userId} = useParams()
  const {eventId} = useParams()
  const {name} = useParams()

  const [event,setEvent] = useState()
  const [userList,setUserList] = useState()
  const [bookList,setBookList] = useState()

  useEffect(()=>{

    const getAllUserBookingByEvent = async()=>{
      try{

        const response = await ApiService.getAllBookingByEvent(userId,eventId)
        setEvent(response.event)
        setUserList(response.userDTOs)
        setBookList(response.bookList)

      }
      catch(err){

      }
    }
    getAllUserBookingByEvent()

  },[userId,eventId])

  const getTime=(time)=>{

    const hours = (time/60).toString().split(".")[0]
    const minutes = (time%60)

    return `${hours} hr ${minutes} min`

  }

  const deleteOrder=async(userId,eventId,orderId)=>{
    setLoading(true)
    try{

      const response = await ApiService.cancelOrder(userId,eventId,orderId)
      setLoading(false)
      window.location.reload()
    }
    catch(err){
      setLoading(false)
    }

  }

  const [loading,setLoading] = useState(false)

  return (
    <div>
      {event&&userList&&bookList?<div>

        <div className='book-title'>
          <div style={{display:'flex',alignItems:'center',gap:'0.6rem',fontSize:"12px"}}>
            <img src={event.eventposter} style={{objectFit:"cover",borderRadius:"5px"}} height={25} width={30}/>
            <p>{'>'}</p>
            <p style={{color:'grey'}}>{event.eventname}</p>
            <p>{'>'}</p>
            <p>User management</p>
          </div>
          <div style={{marginTop:"30px",marginBottom:"30px"}}>
            <h1 style={{fontSize:'23px'}}>User management</h1>
            <p style={{fontSize:'12px',color:'grey'}}>Manage your bookings here</p>
            <p style={{fontSize:'12px',color:'black'}}>Bookings ({bookList.length})</p>
          </div>
          <div style={{marginBottom:"30px"}}>
            <p style={{color:'rgb(210,210,210)',fontSize:'11px'}}>* You can only cancel order of users having pending duration greater than 20 minutes</p>
          </div>
          <div>
            {bookList.length>0?<div>

                <table className='custom-table'>

                  <thead style={{fontSize:"13px"}}>
                    <tr>
                    <th>
                      User name
                    </th>
                    <th>
                      Booking status
                    </th>
                    <th>
                      Booking date
                    </th>
                    <th>
                      Booking price
                    </th>
                    <th>
                      Seats reserved
                    </th>
                    <th>
                      Pending duration
                    </th>
                    <th>
                      
                    </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookList.map((book,index)=>(
                      <tr key={index} style={{fontSize:'11px'}}>
                        <td style={{display:'flex',gap:'0.8rem',alignItems:'center'}}>
                          <img src={userList[index].proilepicture} height={30} width={30} style={{borderRadius:"20px"}}/>
                          <div>
                            <p style={{margin:'0'}}>{userList[index].firstname} {userList[index].lastname}</p>
                            <p style={{color:'grey',margin:"5px 0"}}>{userList[index].email}</p>
                          </div>
                        </td>
                        <td style={{color:book.status==="Success"?'rgb(0,190,0)':'red'}}>
                          {book.status}
                        </td>
                        <td>
                          {book.bookingdate.split("T")[0]}
                        </td>
                        <td>
                          ₹{book.bookingprice * book.seatsreserved}
                        </td>
                        <td>
                          {book.seatsreserved} seats
                        </td>
                        <td>
                          {book.status==="Success"?"...":getTime(book.minuteDuration)}
                        </td>
                        <td className='tablebtn'>
                          {book.status==="Success"?"...":loading ? 
                            <button className="buttonload">
                            <i className="fa fa-spinner fa-spin"></i>
                            </button>
                            :book.minuteDuration>20 && <button onClick={()=>deleteOrder(userList[index].id,event.id,book.orderId)}>Cancel order</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>

            </div>:<p style={{fontSize:'13px',marginTop:"30px",color:'grey'}}>No Bookings</p>}
          </div>
        </div>

      </div>:<Loading/>}
    </div>
  )
}

export default BookingManagement
