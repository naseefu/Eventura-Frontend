import React, { useState, useEffect, useRef } from "react";
import ApiService from "../../service/ApiService";
import './home.css'
import { ChevronRight,ChevronLeft, ArrowUpRight } from 'lucide-react';
import Navbar from "../Commons/Navbar";
import Loading from "../Commons/Loading";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import Footer from "../Commons/Footer";
import DynamicPage from "../Commons/DynamicPage";
import Trending from "./Trending";
import TitleCard from "./TitleCard";
const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [canFetchMore, setCanFetchMore] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [headers,setHeaders] = useState([])
  const [isHeader,setIsHeader] = useState(true)
  const pageSize = 10;
  const loadingRef = useRef(null);
  const [i,setI] = useState(0);
  const headerdata = headers[i];
  const {logout} = useUser()

  const checkTokenExpiration = () => {
    const expiration = localStorage.getItem("authTokenExpiration");
    if (expiration && new Date().getTime() > parseInt(expiration, 10)) {
        logout();
        navigate('/login')
    }
  };
  useEffect(() => {
    checkTokenExpiration();
  }, []);

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
    const [cameFromEvent,setcameFromHome] = useState(false)
    const location = useLocation()
    useEffect(()=>{
      if(cameFromEvent){
        setCurrentPage(0)
        setcameFromHome(false)
      }
    },[cameFromEvent])

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
  const [loading,setLoading] = useState(false)
  
  useEffect(()=>{
    const getFirstHeader=async()=>{
      try{
      const response = await ApiService.getAllEvents(0,4)
      if(isHeader && response.eventList && response.eventList.length > 0){
        setHeaders(response.eventList)
        setIsHeader(false)
      }}
      catch{

      }
    }
    getFirstHeader();
  },[isHeader])


  const [pageNum,setPageNum]= useState(-1)
  const fetchEvents = async (page) => {
    
    if(cameFromEvent){
      setPageNum(0)
      setcameFromHome(false)
    }
    else{
      setPageNum(page)
    }
    setLoading(true)
    if(pageNum>=0){
    try {
      const response = await ApiService.getAllEvents(pageNum, pageSize);
      const newEvents = response.eventList;
      // localStorage.setItem('eventList', JSON.stringify([...localStorage.getItem('eventList'),response.eventList]));
      // localStorage.setItem('eventList', JSON.stringify([localStorage.getItem('eventList') && {...localStorage.getItem('eventList')}, response.eventList]));
      setLoading(false)
      if (page === 0) {
        setEvents(newEvents);
      } else {
        setEvents((prevEvents) => [...prevEvents, ...newEvents]);
      }

      setTotalEvents(response.totalCount);
      if (newEvents.length < pageSize) {
        setCanFetchMore(false);
        setHasNextPage(false);
      } else {
        setHasNextPage(true);
      }
    } catch (error) {
      setLoading(false)
      console.error("Error fetching events:", error);
    }}
  };

  useEffect(() => {
    if (canFetchMore) {
      fetchEvents(currentPage);
    }
  }, [currentPage, canFetchMore]);

  const [date1,setDate1] = useState()
  const [date2,setDate2] = useState()
  const [time1,setTime1] = useState()
  const [time2,setTime2] = useState()
  useEffect(()=>{
  if(headerdata && headerdata.startdate && headerdata.enddate){
    setDate1(formatLocalDateTime(headerdata.startdate))
    setDate2(formatLocalDateTime(headerdata.enddate))
  }
  if(headerdata && headerdata.starttime && headerdata.endtime){
    setTime1(formatLocalTime(headerdata.starttime))
    setTime2(formatLocalTime(headerdata.endtime))
  }
  },[headerdata])

 const loadMore = () => {
    if (hasNextPage) {
      setCurrentPage((prevPage) => {
        const newPage = prevPage + 1;
        return newPage;
      });
      setCanFetchMore(true);
    }
  };
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && canFetchMore) {
      loadMore();
    }
  });

  if (loadingRef.current) {
    observer.observe(loadingRef.current);
  }

  return () => {
    if (loadingRef.current) {
      observer.unobserve(loadingRef.current);
    }
  };
}, [canFetchMore, hasNextPage]);


  useEffect(()=>{
    localStorage.removeItem('eventList');
  },[])
  useEffect(() => {
  const interval = setInterval(() => {
    setI((prevI) => (prevI + 1) % headers.length);
  }, 10000);

  return () => clearInterval(interval);
}, [headers.length]);

  const handlePageClick = (page) => {
    setCurrentPage(page);
    setCanFetchMore(true);
  };
  const totalPages = Math.ceil(totalEvents / pageSize);
    
  const sectionsRef = useRef([]);


  useEffect(() => {
  const options = {
    root: document.querySelector('.scroll-container'), // replace with the actual scrollable container
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show-section');
      } else {
        
      }
    });
  }, options);
  const observeSections = () => {
    sectionsRef.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });
  };

  observeSections();

  return () => {
    sectionsRef.current.forEach((section) => {
      if (section) {
        observer.unobserve(section); 
      }
    });
  };
}, [events]); 

const navigate = useNavigate()

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};
const defaultCenter = {
  lat: 37.7749, // Default latitude (San Francisco)
  lng: -122.4194, // Default longitude (San Francisco)
};

const handleNavigate=(id)=>{
  navigate(`/event/${id}`)
  setcameFromHome(true)
}

const [search,setSearch] = useState("")
const [searchName,setSearchName] = useState()
const [locations,setLocation] = useState("")
const [searchEvent,setSearchEvents] = useState()
const [searchExist,setExist] = useState(false)
const searchEvents=async(search,location)=>{
  setExist(true)
  try{
    setSearchName(search)
    const response = await ApiService.getSearchResult(search,location)
    setSearchEvents(response.eventList)
  }
  catch(err){
    setSearchEvents()
  }
}
  return (
    <div className="home">
      <DynamicPage title="Home" description="Home page of Eventura"/>
      {!events? <Loading/> :<div>
        <div className="home-first">
          <div>
            <Navbar/>
          </div>
          <TitleCard/>
        </div>
        <div style={{padding:'80px 40px 80px 40px'}}>
          <h1 style={{padding:"0 0 40px 0",fontFamily:'sans-serif'}} >Trending Events</h1>
          <Trending/>
      </div>
      {headerdata && (date1 && date2 || time1&& time2) && <div className="home-header" style={{backgroundImage:`url(${headerdata.eventposter})`}} >
        <div className="home-headers1">
        <button className="previous-btn" onClick={()=>setI(!i>0? headers.length-1:(i-1)%headers.length)} style={{zIndex:"99999"}}><ChevronLeft className="chev" size="4.5vw"/></button>
        <button className="next-btn" onClick={()=>setI((i+1)%headers.length)} style={{zIndex:"99999"}}><ChevronRight className="chev" size="4.5vw"/></button>
        <section className="home-header1" >
        {headerdata.eventtype==="Specific" ? <p>Starts {date1[2]} {date1[1]} {date1[4]}</p>:<p>Everyday at {time1}</p>}
        <h1>{headerdata.eventname.slice(0,40)}{headerdata.eventname.length>40&&"..."}</h1>
        <p className="location">Time : {date1[3]}</p>
        <p className="location">Location : {headerdata.location}</p>
        {headerdata.eventtype==="Specific"?<button className="buy" onClick={()=>handleNavigate(headerdata.id)}>Buy Tickets</button>:<button className="buy" onClick={()=>navigate(`/event/${headerdata.id}`)}>Join Now</button>}</section></div>
      </div>}

      
      <div className="search-events" style={{position:"sticky",top:'0',zIndex:"999999"}}>
        <div>
        <input className="search" placeholder="Event name, Event type ..." value={search} onChange={(e)=>setSearch(e.target.value)}></input>
        </div>
        <div>
          <input className="location" placeholder="Location" value={locations} onChange={(e)=>setLocation(e.target.value)}></input>
        </div>
        <div>
          <button className="search-btn" onClick={()=>searchEvents(search,locations)}>Search</button>
        </div>
      </div>


      { searchExist ? searchEvent && searchEvent.length>0 ? 
      
      <div className="up-events">
      <h1 className="up-h">Your Search Result {searchName&& `For ${searchName}`}</h1>
      <p onClick={()=>setExist(false)} style={{color:'black',textAlign:'center',cursor:"pointer",display:'flex',alignItems:'center',margin:"0 auto",gap:'0.5rem',border:'1px solid rgba(0,0,0,0.2)',fontSize:"13px",width:'fit-content',borderRadius:"10px",padding:'5px 10px'}}>Full Lineup<span><ArrowUpRight style={{backgroundColor:"black",color:'white',padding:'5px 5px',borderRadius:'20px'}} className='arrow' size={13}/></span></p>
      <ul>
        <div className="event-cards" >
        {searchEvent.map((event, index) => (
          <div className="event-card" style={{opacity:'1'}} key={index}  onClick={()=>handleNavigate(event.id)}>
          <div className="event-card1" style={{
            backgroundImage: `url(${event.eventposter})`,
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height:"400px",minWidth:'40vw',borderRadius:"50px 50px 0 0"
        }}>
            {/* <img src={event.eventposter}/> */}
          </div>
          <div className="event-card2" >
            <div className="event-card21">
            <h3 style={{fontFamily:'mainfont,sans-serif'}}>{event.eventname}</h3>
            {event.eventtype==="Specific"?<p style={{width:"25vw",fontSize:"14px"}}><span style={{color:"rgb(0,245,0)"}}>{event.location}</span> - {formatLocalDateTime(event.startdate)[1]} {formatLocalDateTime(event.startdate)[4]}, {formatLocalDateTime(event.startdate)[2]} {formatLocalDateTime(event.startdate)[3]}</p>
              : <p style={{fontSize:"14px"}}><span style={{color:"rgb(0,245,0)"}}>{event.location}</span> - Everyday at {formatLocalTime(event.starttime)}</p>  
            }</div>
            <div className="event-card22">
              {/* {event.initialprice && <p>{event.initialprice}</p>} */}
              {event.canceled? <p style={{color:'grey'}}>Cancelled</p>:<p className="eventprice">₹{event.price}</p>}
            </div>
            </div>
          </div>
        ))}</div>
      </ul>
      </div>:events?<Loading/>:<div className="no-event">
        <h1 className="no-events">There is no such events</h1>
        <button onClick={()=>setExist(false)}>Explore Our Events</button>
      </div>
        
      :


      <div className="up-events">
      <h1 className="up-h">Explore Our Full Event Lineup</h1>
      <ul>
        <div className="event-cards" >
        {events.map((event, index) => (
          <div className="event-card" key={index} ref={(el) => sectionsRef.current[index+2] = el} onClick={()=>handleNavigate(event.id)}>
          <div className="event-card1" style={{
            backgroundImage: `url(${event.eventposter})`,
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height:"400px",minWidth:'40vw',borderRadius:"50px 50px 0 0"
        }}>
            {/* <img src={event.eventposter}/> */}
          </div>
          <div className="event-card2">
            <div className="event-card21">
            <h3 style={{fontFamily:'mainfont,sans-serif'}}>{event.eventname}</h3>
            {event.eventtype==="Specific"?<p style={{width:"25vw",fontSize:"14px"}}><span style={{color:"rgb(0,245,0)"}}>{event.location}</span> - {formatLocalDateTime(event.startdate)[1]} {formatLocalDateTime(event.startdate)[4]}, {formatLocalDateTime(event.startdate)[2]} {formatLocalDateTime(event.startdate)[3]}</p>
              : <p style={{fontSize:"14px"}}><span style={{color:"rgb(0,245,0)"}}>{event.location}</span> - Everyday at {formatLocalTime(event.starttime)}</p>  
            }</div>
            <div className="event-card22">
              {/* {event.initialprice && <p>{event.initialprice}</p>} */}
              {event.canceled? <p style={{color:'grey'}}>Cancelled</p>:<p className="eventprice">₹{event.price}</p>}
            </div>
            </div>
          </div>
          
        ))}</div>
      </ul>
      {!canFetchMore && <div><p style={{textAlign:'center',color:'grey',paddingBottom:"20px"}}>No more events</p></div>}
      </div>}
      {!canFetchMore && <Footer/>}
      <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index} onClick={() => handlePageClick(index)}>
            Page {index + 1}
          </button>
        ))}
        {/* Next button */}
        {/* {(
          <div className="" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
          <button onClick={()=>loadMore()} style={{ marginLeft: "10px",border:'none',backgroundColor:"black",padding:'8px 10px',color:'white',borderRadius:'30px',cursor:"pointer" }}>
            <ChevronRight/>
          </button>
          </div>
        )} */}
      </div>

      {canFetchMore && <div ref={loadingRef} style={{ height: "20px" }} />}</div>}
    </div>
  );
};

export default EventsList;
