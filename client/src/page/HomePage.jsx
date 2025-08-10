import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Hero from '@/components/Hero'


const HomePage = ({auth ,user, button}) => {

   
  return (
    <div>

      <Header auth={auth} user={user} button={button} />
      <Hero isAuth={auth}/>
      <Footer/>

    </div>
  )
}

export default HomePage