import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import React from 'react'
import { useNavigate } from 'react-router-dom'
const HomePage = ({auth ,user, button}) => {
   const navigate = useNavigate();
  return (
    <div>

      <Header auth={auth} user={user} button={button} />
      <Hero isAuth={auth}/>
      <Footer/>

    </div>
  )
}

export default HomePage