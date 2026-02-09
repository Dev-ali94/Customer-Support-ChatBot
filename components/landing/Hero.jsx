import { ArrowRightIcon } from 'lucide-react'
import React from 'react'

const Hero = () => {
    return (
        <section className='relative pb-20 pt-32 md:pt-48 md:pb-32 px-6 overflow-hidden'>
            <div className='max-w-4xl mx-auto text-center relative z-20'>
                <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 animate-float'>
                    <span className='w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' />
                    <span className='text-xs text-zinc-300 tracking-wide font-light'>version 1.0.0 avaliable now</span>
                </div>
                <h1 className='animate-float text-5xl md:text-7xl font-medium tracking-tight text-white mb-6 leading-[1.1]'>
                    Human Friendly AI Chatbot
                    <br />
                    <span className='text-zinc-500'>Powerd By AI</span>
                </h1>
                <p className='text-lg md:text-xl text-zinc-400  font-light  mb-10 max-w-3xl mx-auto leading-relaxed'>
                    Instanlty solve your customer support queries with our AI chatbot.Also it can be used for 24/7 customer support.Eaasy Integration with your website.
                </p>
                <div className='flex flex-col items-center gap-4 mb-20 justify-center sm:flex-row'>
                    <button className='h-11 px-8 rounded-full bg-white text-black flex items-center justify-center gap-2  text-sm font-medium hover:bg-zinc-200 transition-all duration-300 '>
                        Start for Free
                        <ArrowRightIcon className='w-4 h-4' />
                    </button>
                    <button className='h-11 px-8 rounded-full border-2 border-zinc-800 hover:text-white bg-black/20 backdrop-blur-sm font-medium text-sm hover:border-zinc-600'>View Demo</button>
                </div>
            </div>

        </section>
    )
}

export default Hero