import ChatBotModel from '@/components/landing/ChatBotModel'
import Features from '@/components/landing/Features'
import Hero from '@/components/landing/Hero'
import Integration from '@/components/landing/Integration'
import Navbar from '@/components/landing/Navbar'
import Pricing from '@/components/landing/Pricing'
import Footer from '@/components/landing/Footer'

const page = () => {
  return (
    <main className='w-full flex flex-col relative z-10'>
      <Navbar />
      <Hero />
      <ChatBotModel />
      <Features />
      <Integration />
      <Pricing />
      <Footer />
    </main>
  )
}

export default page
