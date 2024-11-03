// src/InfiniteScroll.js
import React, { useEffect, useState } from 'react';
import './trending.css';
import ApiService from '../../service/ApiService';

const Trending = () => {
  const items = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);
  const [eventList,setEvents] = useState()
  useEffect(()=>{
    const getEvents = async()=>{
      try{
        const response = await ApiService.getAllEvents(0,20)
        console.log(response)
        setEvents(response.eventList);
      }
      catch(err){

      }
    }
    getEvents();
  },[])

  return (
    <div className='scroll-container' style={{padding:"30px 0"}}>
      <div className='carousel-primary'>
        {eventList && eventList.map((eve,index)=>(
          <div key={index} style={{height:'350px',position:'relative'}}>
            <img style={{height:'350px',objectFit:'cover'}} src={eve.eventposter} alt=''/>
            <p style={{color:'white',fontSize:'16px',position:'absolute',zIndex:'9999',bottom:'0%',left:'10%',display:'flex',flexDirection:'column',gap:'1rem'}}>{eve.eventname}</p>
            {/* <span style={{border:'1px solid grey',width:'fit-content',padding:"5px 5px",borderRadius:"13px"}}>
              {eve.category}
            </span> */}
          </div>
        ))}
      </div>
      <div className='carousel-primary carousel-secondary' style={{left:'100%'}}>
          {eventList && eventList.map((eve,index)=>(
          <div style={{height:'350px'}}>
          <img style={{height:'350px',objectFit:'cover'}} src={eve.eventposter} />
          </div>
        ))}
      </div>
    </div>
  );

};

export default Trending;
