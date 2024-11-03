import React, { useState } from "react";
import axios from "axios";
import ApiService from "../../service/ApiService";

  const handlePayment = async ({money}) => {

      try{
        const order = await ApiService.createOrder(money >0 && money);
        const { id: id, currency, amount: amount } = order;

        const options = {
            key: "razorpay_key_id",
            amount: amount,
            currency: currency,
            name: "Event Booking",
            description: "Book your event",
            id: id,
            handler: function (response) {
                alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
                
            },
            prefill: {
                name: "User Name",
                email: "user@example.com",
                contact: "9999999999",
            },
            notes: {
                address: "Event Location",
            },
            theme: {
                color: "#3399cc",
            },
            modal: {
            onDismiss: function () {
              alert("Payment was not completed. Please try again.");
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      
      }

        catch(err){
          
          console.log(err);
        }
    };
