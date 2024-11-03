import React, { useEffect, useState } from 'react'
import { useUser } from '../Context/UserContext'
import { Pencil } from 'lucide-react'
import './profile.css'
import ApiService from '../../service/ApiService'
import { useNavigate } from 'react-router-dom'
import 'font-awesome/css/font-awesome.min.css';

const ProfileUser = () => {
  const { user } = useUser()
  const [firstname, setFirst] = useState(user?.firstname || "")
  const [middlename, setMiddle] = useState(user?.midname || "")
  const [lastname, setLast] = useState(user?.lastname || "")
  const [email, setEmail] = useState(user?.email || "")
  const [dob, setDob] = useState(user?.dob || "")
  const [edit, setEdit] = useState(false)
  const [succes, setSucces] = useState('')
  const [error, setError] = useState('')
  const [loading,setLoading] = useState(false)

  const handleDone = async () => {
    setLoading(true)
    try {
      const response = await ApiService.editProfile({ id: user.id, firstname, middlename, lastname, dob })
      localStorage.removeItem('user')
      localStorage.setItem('user', JSON.stringify(response.userDTO))
      setLoading(false)
      setSucces("Edited successfully")
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || "An error occurred")
    }
  }

  const navigate = useNavigate();

  useEffect(()=>{

    if(succes){
      setTimeout(()=>{
        setSucces('')
        window.location.reload()
      },3000)
    }
    if(error){
      setTimeout(()=>{
        setError('')
      },3000)
    }

  },[error,succes])

  return (
    <div className='userprofile'>
      <div>
        <div>
          <h1>Your Profile</h1>
        </div>
        {user && <div>
          <div className='profile1' style={{display:'flex',alignItems:'center',gap:'0.6rem',padding:'20px 20px'}}>
            <img src={user.proilepicture} style={{borderRadius:"40px",height:'45px'}} alt='icon'/>
            <div>
              <p>{user.firstname} {user.midname&&user.midname} {user.lastname}</p>
              <p>{user.location}</p>
            </div>
          </div>
          <div className='profile2'>
            <div style={{display:'grid',padding:"0px 0 10px 0",alignItems:'start',gap:'2rem',justifyContent:'space-between',gridTemplateColumns:'1fr 1fr'}}>
              <h3>Personal Information</h3>
              {!edit && <p style={{border:'1px solid rgb(228, 228, 228)',width:'fit-content',padding:'5px 10px',borderRadius:'10px',cursor:'pointer',fontSize:'14px'}} onClick={()=>setEdit(true)}>Edit <span><Pencil size={13} /></span></p>}
            </div>
            {!edit ? <div className='userdetails' style={{display:'grid',gridTemplateColumns:"1fr 1fr",gap:'2rem',justifyContent:'space-between'}}>
              <div>
                <h3>First name</h3>
                <p>{user.firstname.slice(0,15)}</p>
              </div>
              {user.midname&& <div>
                <h3>Middle name</h3>
                <p>{user.midname.slice(0,15)}</p>
              </div>}
              <div>
                <h3>Last name</h3>
                <p>{user.lastname.slice(0,15)}</p>
              </div>
              <div>
                <h3>Email address</h3>
                <p>{user.email}</p>
              </div>
              <div>
                <h3>Date of Birth</h3>
                <p>{user.dob}</p>
              </div>

            </div>:
            <div className='newuser' style={{paddingBottom:'40px'}}>
            {error && <p style={{margin:'10px 0px',color:'red',fontSize:'13px'}}>{error}</p>}
            {succes && <p style={{margin:'10px 0px',color:'green',fontSize:'13px'}}>{succes}</p>}
            <div className='userdetails' style={{display:'grid',gridTemplateColumns:"1fr 1fr",gap:'2rem',justifyContent:'space-between'}}>
              <div>
                <h3>First name</h3>
                <input type='text' value={firstname} placeholder='Enter your first name' onChange={(e)=>setFirst(e.target.value)}/>
              </div>
              <div>
                <h3>Middle name</h3>
                <input type='text' value={middlename} placeholder='Enter your Middle name' onChange={(e)=>setMiddle(e.target.value)}/>
              </div>
              <div>
                <h3>Last name</h3>
                <input type='text' value={lastname} placeholder='Enter your Last name' onChange={(e)=>setLast(e.target.value)}/>
              </div>
              <div>
                <h3>Email address</h3>
                <input type='text' style={{cursor:'not-allowed'}} value={email} disabled placeholder='Enter your Email' onChange={(e)=>setEmail(e.target.value)}/>
              </div>
              <div>
                <h3>Date of Birth</h3>
                <input type='date' value={dob} placeholder='Enter your date of birth' onChange={(e)=>setDob(e.target.value)}/>
              </div>
            </div>
            <div className='buttons'>
              {loading ? 
              <button className="buttonload" style={{marginTop:"3rem",border:'none',padding:'10px 30px',cursor:'pointer'}}>
                <i className="fa fa-spinner fa-spin"></i>
              </button>
              :<button style={{marginTop:"3rem",border:'none',padding:'10px 30px',cursor:'pointer'}} onClick={handleDone}>Done editing</button>}
              <button style={{marginTop:"3rem",border:'none',padding:'10px 30px',cursor:'pointer',backgroundColor:"red"}} onClick={()=>setEdit(false)}>Cancel</button>
            </div>
            </div>}
          </div>
          <div>

          </div>
        </div>
        
        }
      </div>
      <div>
      </div>
    </div>
  )
}

export default ProfileUser
