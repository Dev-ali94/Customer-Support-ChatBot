import { BookOpen, CheckCircle2, ShieldCheck } from 'lucide-react'
import React from 'react'

const Features = () => {
    return (
        <section id='feature' className='py-32 px-6 max-w-6xl mx-auto'>
            <div className='mb-20'>
                <h2 className='text-2xl  md:text-5xl font-medium text-white tracking-tight mb-6'>
                    Designed for trust.
                </h2>

                <p className='text-xl text-zinc-500 font-light max-w-2xl leading-relaxed'>
                    Chatbot.AI is built on a foundation of privacy and control. It's designed to be transparent, secure and easy to use.
                </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                <div className='group p-8 rounded-3xl border border-white/5 bg-linear-to-br from-white/3 to-transparent hover:border-white/10 transition-colors  '>
                    <div className='w-12 h-12 rounded-2xl bg-[#0A0A0E] border border-white/5 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform'>
                        <BookOpen className='h-6 w-6 text-zinc-300' />
                    </div>
                    <h3 className='text-lg font-medium text-white mb-3'>Knowledge Base</h3>
                    <p className='text-sm text-zinc-400 leading-relaxed font-light'>Connect your chatbot to internal documents, websites, and databases. Provide instant, accurate answers based on your specific knowledge.</p>
                </div>
                <div className='group p-8 rounded-3xl border border-white/5 bg-linear-to-br from-white/3 to-transparent hover:border-white/10 transition-colors  '>
                    <div className='w-12 h-12 rounded-2xl bg-[#0A0A0E] border border-white/5 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform'>
                        <ShieldCheck className='h-6 w-6 text-zinc-300' />
                    </div>
                    <h3 className='text-lg font-medium text-white mb-3'>Security & Privacy</h3>
                    <p className='text-sm text-zinc-400 leading-relaxed font-light'>Your data stays with you. Chatbot.AI uses enterprise-grade security and privacy controls to keep your information safe and confidential.</p>
                </div>
                <div className='group p-8 rounded-3xl border border-white/5 bg-linear-to-br from-white/3 to-transparent hover:border-white/10 transition-colors  '>
                    <div className='w-12 h-12 rounded-2xl bg-[#0A0A0E] border border-white/5 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform'>
                        <CheckCircle2 className='h-6 w-6 text-zinc-300' />
                    </div>
                    <h3 className='text-lg font-medium text-white mb-3'>Easy to Use</h3>
                    <p className='text-sm text-zinc-400 leading-relaxed font-light'>It's just one script to deploy on your website.Safely and securely ith custom built UI.</p>
                </div>
            </div>
        </section>
    )
}

export default Features