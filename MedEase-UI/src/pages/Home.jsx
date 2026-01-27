import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import WhyChoose from '../components/WhyChoose'
import About from '../components/About'
import CommunityFollow from '../components/CommunityFollow'
import Plan from '../components/Plan'
import Testimonial from '../components/Testimonial'
import Footer from '../components/Footer'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 overflow-x-hidden">
      <Navbar />
      <Hero />
      <WhyChoose />
      <About />
      <CommunityFollow />
      <Plan />
      <Testimonial />
      <Footer />
    </div>
  )
}

export default Home

