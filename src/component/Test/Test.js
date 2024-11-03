import React, { useEffect, useRef, useState } from 'react';
import './test.css';
import CryptoJS from 'crypto-js';
import { useParams } from 'react-router-dom';

const Test = () => {
    
  const {id} = useParams()
  const secretKey = 'optimusxpain123123as7812938kashjkjasjkbkasf';

  const decryptId = (encryptedId) => {
    const adjustedId = encryptedId.replace(/_/g, '/');
    const bytes = CryptoJS.AES.decrypt(adjustedId, secretKey);
    const originalId = bytes.toString(CryptoJS.enc.Utf8);
    return originalId
  };

  const decid = id && decryptId(id)

    return (
        <div className="otp-input">
          {decid && decid}
        </div>
    );
};

export default Test;
