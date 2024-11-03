import React, { useState } from 'react'
import './navbar.css'
import logo from '../images/logo1.png'
import { NavLink, useNavigate } from 'react-router-dom'
import { useUser } from '../Context/UserContext'
const Navbar = () => {

  const [popup,setPopup] = useState(false)
  const navigate = useNavigate()
  const {user,logout} = useUser()
  const handleLogout=()=>{
    logout()
    navigate('/login')
  }
  return (
    <div className='navbar'>
      {popup && <div className='popup' style={{height:"100vh",zIndex:"999999"}}>
        <div className='popups'>
        <h2>Do you want to logout from here?</h2>
        <div className='pop-btns'>
          <button onClick={()=>setPopup(false)} style={{color:"black"}}>cancel</button>
          <button onClick={handleLogout} style={{color:'red'}}>logout</button>
        </div></div>
      </div>}
      <div className='nav-logo'>
        <img src={logo} alt='E' />
      </div>
      <div className='nav-elements'>
      <NavLink to='/' activeclassname="active" className="inactive">Home</NavLink>
      <NavLink to='/about' activeclassname="active" className="inactive">About</NavLink>
      <NavLink to='/contact' activeclassname="active" className="inactive">Contact</NavLink>
      {user&& user.role==="HOST"&&<NavLink to='/host-events' activeclassname="active" className="inactive">Host Events</NavLink>}
      {user ? <p activeclassname="active" className="inactive" onClick={()=>setPopup(true)}>Logout</p>:<p className="inactive" to='/' activeclassname="active" onClick={()=>navigate('/login')}>Login</p>}
      {user ? <p className="inactive" style={{display:'flex',fontSize:'14px',fontWeight:'lighter',alignItems:'center',gap:'1rem',backgroundColor:'black',color:'white',padding:'7px 15px',borderRadius:"20px"}} onClick={()=>navigate('/profile')}>{user.firstname} <img style={{height:'35px',borderRadius:"20px"}} src={user.proilepicture}/></p>:<p  className="inactive" to='/' activeclassname="active" onClick={()=>navigate('/signup')}>Register</p>}  
      </div>
    </div>
  )
}

export default Navbar
