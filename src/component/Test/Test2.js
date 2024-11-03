import React from 'react'
import { useNavigate } from 'react-router-dom'
import CryptoJS from 'crypto-js';

const Test2 = () => {

  const secretKey = 'optimusxpain123123as7812938kashjkjasjkbkasf';
  const navigate = useNavigate()
  const num =11;
  const encryptId = (id) => {
  const ciphertext = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
  return ciphertext.replace(/\//g, '_');
};

  const handleNavigate=()=>{
    
    const id = encryptId(num)
    navigate(`/test/${id}`) 

  }

  return (
    <div>
      <button onClick={handleNavigate}>Go</button>
    </div>
  )
}

export default Test2
