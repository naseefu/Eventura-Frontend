import React, { useEffect, useState } from 'react'
import './ticket.css'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CalendarDays, Download, Timer } from 'lucide-react';
import { useUser } from '../Context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import Loading from '../Commons/Loading';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import Barcode from 'react-barcode';
import QRCode from 'qrcode';
import img1 from '../images/grad8.jpg'
import Navbar from '../Commons/Navbar';

const Ticket = () => {

const paymentid= "Pajasdl2asdk"

const {user} = useUser()
const {id} = useParams()

const [event,setEvent] = useState()
const [book,setBook] = useState()

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


const downloadPDF = () => {
  const content = document.getElementById('pdf-content');
  const originalWidth = content.style.width;
  const originalHeight = content.style.height;
  
  content.style.width = '500px';
  content.style.height = '500px';

  html2canvas(content, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = 500 * 0.264583;
    const imgHeight = 500 * 0.264583; 

    const x = (pdfWidth - imgWidth) / 2;
    const y = (pdfHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    pdf.save(`${event.eventname}_ticket.pdf`);
  }).finally(() => {
    content.style.width = originalWidth;
    content.style.height = originalHeight;
  });
};

const generateQRCode = async (text) => {
  try {
    // Generate QR code as a data URL
    const qrDataURL = await QRCode.toDataURL(text);
    
    // Set the QR code image source to the generated data URL
    const qrImage = document.getElementById('qr-code');
    qrImage.src = qrDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
};

// Example usage: Generate a QR code for a URL or text
generateQRCode(book&&book.bookingId);

const navigate = useNavigate()
  useEffect(()=>{

    const getEventTicket=async()=>{
      try{
        const response = await ApiService.getEventTicket(user?.id,id&&id);
        setEvent(response.event)
        setBook(response.bookingDTO)
        console.log(response)
      }
      catch(err){
        navigate("/profile/bookings")
      }
    }
    getEventTicket()

  },[user,id])

  const [width, setWidth] = useState(2); // Default width

  useEffect(() => {
    const handleResize = () => {
      
      setWidth(window.innerWidth<400 &&1 || window.innerWidth < 600 &&1.5 || window.innerWidth>600&& 2);
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
  <div>{event&&book? <div className='eachbooking' style={{display:'flex',flexDirection:'column',alignContent:'center',justifyContent:'center',minHeight:"100vh",backgroundImage:`url(https://images.pexels.com/photos/1098810/pexels-photo-1098810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)`}}>
    <Navbar/>
    <div className='ogeachbooking'>
    <div className='containbook' >
    <div id='pdf-content' class="container" style={{display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
      <div>
    <div class="half-circle">
      <h1 style={{fontFamily:'sans-serif',textAlign:'center',fontSize:'25px'}}>{event.eventname}</h1>
    </div>
    <div>
      <div className='tick'>
          {event.eventtype==="Everyday"?<div className='ticks'>
            <div className='tick1'>
              <h3>Date</h3>
              <p>Everyday</p>
            </div> 
            <div className='tick1'> 
              <h3>Time</h3>
              <p>{formatLocalTime(event.starttime)}</p>
            </div>
            </div>:
          <div className='ticks'>
            <div className='tick1'>
              <h3>Date</h3>
              <p>{formatLocalDateTime(event.startdate)[1].slice(0,3)} {formatLocalDateTime(event.startdate)[4]} {formatLocalDateTime(event.startdate)[0]}
              </p>
            </div>
          <div className='tick1'>
            <h3>Time</h3>
            <p>{formatLocalDateTime(event.startdate)[2]} {formatLocalDateTime(event.startdate)[3]}</p>
          </div>
          </div>}
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{margin:'20px 10px'}}>
          <h3>Seats Reserved</h3>
          <p>{book.seatsreserved} seats</p>
        </div>
        <div style={{margin:'20px 10px'}}>
          <h3>Booking ID</h3>
          <p>{book.bookingId}</p>
        </div>
      </div>
      <div style={{textAlign:'center',margin:"0 80px"}}>
        <h3>Place</h3>
        <p>{event.location}</p>
      </div>
    </div></div>
    <div style={{textAlign:'center'}}>
      <img id="qr-code" alt="QR Code" />
    </div>
  </div>
  <div style={{padding:"20px"}}></div></div>
   <button onClick={downloadPDF}>Download <span><Download height={16} /></span></button>
  </div>
  </div>:<Loading/>}</div>

  )
}

export default Ticket
