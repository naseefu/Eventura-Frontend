import React from 'react'
import { useUser } from '../Context/UserContext'
import './profile.css'
import { Pencil } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import Navbar from '../Commons/Navbar'
import DynamicPage from '../Commons/DynamicPage'

const Profile = () => {

  const {user} = useUser()

  return (
    <div className='fullprofile'>
      <Navbar/>
      <DynamicPage title="profile" description="User profile"/>
    <div className='profile'>
      <div className='title'>
        <h1 style={{fontSize:"30px"}}>Account Settings</h1>
      </div>
      <div className='profiles'>
      <div className='profilenav'>
        <NavLink activeclassname="active" className="profilebtn" to='bookings'>Bookings</NavLink>
        {user.role==="HOST" && <NavLink activeclassname="active" className="profilebtn" to='your-events' style={{lineHeight:"22px"}}>Hosted Events</NavLink>}
        <NavLink activeclassname="active" className="profilebtn" to='user'>Profile</NavLink>
        <NavLink activeclassname="active" className="profilebtn" to='security'>Security</NavLink>
        <NavLink activeclassname="active" className="profilebtn" to='billing'>Billing</NavLink>
      </div>
      <div className='profileoutlet' style={{width:'100%'}}>
        <Outlet/>
      </div></div>
    </div></div>
  )
}

export default Profile
