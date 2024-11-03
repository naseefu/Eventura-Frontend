import React from 'react'
import './loading.css'
const Loading = () => {
  return (
    <div className='loading'>
      <div className='box'></div>
      <p>Loading <span className='span1'>.</span><span className='span2'>.</span><span className='span2'>.</span></p>
    </div>
  )
}
export default Loading
