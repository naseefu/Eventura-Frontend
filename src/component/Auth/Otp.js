import React, { useEffect, useRef, useState } from 'react';
import './otp.css'; // Ensure this CSS file is created for styling
import img1 from  '../images/grad10.jpg'
import logo from '../images/logo1.png'
import 'font-awesome/css/font-awesome.min.css';
import ApiService from '../../service/ApiService';
import { useNavigate, useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const Otp = () => {
    const inputs = useRef([]);
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [error, setError] = useState('');
    const [isLoading,setLoading] = useState(false)
    const {id} = useParams()

    const secretKey = 'optimusxpain123123as7812938kashjkjasjkbkasf';

    const decryptId = (encryptedId) => {
    const adjustedId = encryptedId.replace(/_/g, '/');
    const bytes = CryptoJS.AES.decrypt(adjustedId, secretKey);
    const originalId = bytes.toString(CryptoJS.enc.Utf8);
    return originalId
    };

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value !== '' && index < inputs.current.length - 1) {
                inputs.current[index + 1].focus();
            } else if (value === '' && index > 0) {
                inputs.current[index - 1].focus();
            }
        }
    };

    const navigate= useNavigate()

    const handleOtpSend = async() => {
        setLoading(true)
        if (otp.some(val => val === '')) {
            setError("Fill all the fields");
            setLoading(false)
        } else {
            
          try{
            const userId = id&& decryptId(id);
            const otps = otp.join('');
            const response = await ApiService.otpVerificaton(userId,otps)
            setError('');
            setLoading(false)
            navigate('/login')

          }
          catch(err){
            setLoading('')
            setError(err.response?.data?.message || "An error occured")
          }

        }
    };

    useEffect(()=>{
      setTimeout(()=>{
        setError('')
      },4000)
    })

    return (
        <div className="otp-input">
          <div className='otp'>
            <div style={{display:'flex',flexDirection:'column',gap:'3rem'}}>
            <div style={{display:'flex',gap:"0.5rem",alignItems:'center'}}>
              <img src={logo} height={40}/>
            </div>
            <div >
              <h2>Verify your account</h2>
              <p>Enter the verification code send to your phone</p>
              <div className="input-container">
              {otp.map((value, index) => (
                <input
                    key={index}
                    ref={(el) => (inputs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={value}
                    onChange={(e) => handleChange(e, index)}
                    className="otp-box"
                />
              ))}</div>
            <p style={{color:'grey'}}>Haven't recieved the email? <span style={{color:'blue'}}>Send again</span></p>
            {error && <div className="error-message"><p style={{color:'red',fontSize:"12px"}}>{error}</p></div>}
            <div>
            </div>
            {isLoading ? 
              <button className="buttonload signup-button">
                <i className="fa fa-spinner fa-spin"></i>
              </button>
              :
              <button onClick={handleOtpSend}>Send OTP</button>}</div>
            </div>
              
              <div>
                <img style={{borderRadius:"20px"}} src={img1} height='500px'/>
              </div>
              
            </div>
        </div>
    );
};

export default Otp;
