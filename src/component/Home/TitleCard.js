import React from 'react'
import Navbar from '../Commons/Navbar'

const TitleCard = () => {
  return (
    <div className='scroll-container' style={{width:'100vw',height:"80vh",position:"relative",backgroundColor:'black'}}>
    
    <video style={{width:"100%",height:'100%',objectFit:'cover'}} autoPlay muted loop playsInline data-testid="@video-player/videoplayer" playsinline="" class="sc-f66648e1-1 iIQlzO"><source src="https://cdn-user.veed.io/render/premium/f4a86ad5-c59a-4fb4-9976-b7db017a1635.mp4#t=0.001" type="video/mp4" data-testid="@video-player/source"></source></video>
    <div style={{padding:"60px 20px",zIndex:"99999",color:'white',position:"absolute",textAlign:'center',width:'100%',top:"50%",left:"50%",transform:'translate(-50%,-50%)'}}>
            <h1 className="eventuratitle" style={{opacity:'1',fontSize:"9vw",color:'white'}}>EVENTURA EVENTS</h1>
            <div class="marquee">
            <div class="marquee-content" >
              <p>Your dream event, crafted with precision and creativity, designed to captivate and leave lasting memories for you and your guests</p>
            </div>
            </div>
    
    </div>
    </div>
  )
}

export default TitleCard
