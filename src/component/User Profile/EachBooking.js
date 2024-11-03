import React from 'react'
import { useParams } from 'react-router-dom'
import { useUser } from '../Context/UserContext'

const EachBooking = () => {

  const {id} = useParams()
  const {user} = useUser()

  return (
    <div>
      {/* <h3>Your Ticket</h3>
          <p>Booking ID: {book[0].bookingId}</p>
          <Barcode
            value={book[0].bookingId}
            format="CODE128"
            width={2}
            height={100}
            displayValue={false}
            fontOptions="bold"
          /> */}

    </div>
  )
}

export default EachBooking
