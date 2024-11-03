import React from 'react'
import img1 from '../images/404-1.png'
import './notfound.css'
import { MoveDownRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Commons/Navbar'
const Notfound = () => {
  const navigate = useNavigate()
  return (
    <div className='notfound' style={{backgroundColor:'white',minHeight:'100vh'}}>
      <div className='not-header' >
        <Navbar/>
      </div>
    <div className='not-content'>
      <div className='not-title'>
        <h1>Looks like there's not</h1>
        <h1>enough space for that <span style={{border:'2px solid white',borderRadius:'10px',padding:"5px"}}>page</span></h1>
      </div>
      <div className='not-desc'>
        <p>Error 404 Page not found</p>
      </div>
      <div className='not-img'>
        <img src={img1} alt="404"/>
      </div>
      <div className='not-btn'>
        <p>If you believe this is a mistake, please let us know and we'll get it sorted out.</p>
        <button onClick={()=>navigate('/')} style={{cursor:'pointer'}}>Go back to home <span><MoveDownRight height='14px' /></span></button>
      </div>
    </div></div>
  )
}

export default Notfound
