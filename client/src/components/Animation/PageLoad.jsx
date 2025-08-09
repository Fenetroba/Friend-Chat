import React from 'react'
import '../../App.css'
const PageLoad = () => {
  return (
    <div className='flex justify-center items-center h-screen w-full'>

<div className="loader">
  <div className="loader__bar"></div>
  <div className="loader__bar"></div>
  <div className="loader__bar"></div>
  <div className="loader__bar"></div>
  <div className="loader__bar"></div>
  <div className="loader__ball"></div>
</div>
    </div>
  )
}

export default PageLoad