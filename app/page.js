import ChatBotModel from '@/components/landing/ChatBotModel'
import Features from '@/components/landing/Features'
import Hero from '@/components/landing/Hero'
import Integration from '@/components/landing/Integration'
import Navbar from '@/components/landing/Navbar'
import React from 'react'

const page = () => {
  return (
    <main className='w-full flex flex-col relative z-10'>
      <Navbar />
      <Hero />
      <ChatBotModel />
      <Features />
      <Integration />
    </main>
  )
}

export default page
