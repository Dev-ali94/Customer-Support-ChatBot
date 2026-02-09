import React from 'react'
import { assets } from '@/assets/assets'
import { Send, User } from 'lucide-react'
import Image from 'next/image'

const ChatBotModel = () => {
    return (
        <div className='max-w-3xl mx-auto realtive z-10 '>
            <div className='absolute inset-0  rounded-full pointer-events-none' />
            <div className='rounded-2xl p-1 md:p-2 realtive overflow-hidden ring-1 ring-white/20 bg-[#0a0a0e] shadow-2xl'>
                <div className="flex flex-col h-125 md:150 bg-[#0a0a0e] rounded-xl overflow-hidden ">
                    <div className='h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0E0E12] shrink-0'>
                        <div className='flex items-center gap-2'>
                            <div className='w-4 h-4 rounded-full bg-emerald-500 animate-pulse' />
                            <span className='text-sm font-medium text-zinc-300'>ChatBot.AI Inc</span>
                        </div>
                    </div>
                    <div className='flex-1 overflow-y-auto space-y-6 bg-zinc-950/30 mt-4'>
                        <div className='flex flex-col items-start w-full'>
                            <div className='flex max-w-[85%] gap-3 flex-row'>
                                <div className='w-8 h-8  rounded-full flex items-center justify-center shrink-0 border border-white/5'>
                                    <Image src={assets.agent_icon} alt="xyz" className='w-full h-full object-cover rounded-full' />
                                </div>
                                <div className='space-y-1'>
                                    <div className='p-4 rounded-2xl text-sm leading-relaxed sahdow-sm bg-white text-zinc-900 rounded-tl-sm'>Hi, How can i help you today?</div>
                                    <div className='flex flex-wrap gap-2 pt-1 ml-1'>
                                        <span className='px-3 py-1.5  rounded-full border border-zinc-700 bg-zinc-800/50 text-zinc-300 text-xs font-medium cursor-default'>FAQ</span>
                                        <span className='px-3 py-1.5  rounded-full border border-zinc-700 bg-zinc-800/50 text-zinc-300 text-xs font-medium cursor-default'>Pricing</span>
                                        <span className='px-3 py-1.5  rounded-full border border-zinc-700 bg-zinc-800/50 text-zinc-300 text-xs font-medium cursor-default'>Support</span>

                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col items-end w-full'>
                                <div className="flex max-w-[85%] gap-3 flex-row-reverse">
                                    <div className='flex items-center justify-center h-8 w-8 rounded-full shrink-0 border border-white/5 bg-zinc-800 '>
                                        <User className='w-4 h-4 text-zinc-400' />
                                    </div>
                                    <div className='p-4 rounded-2xl text-sm leading-relaxed shadow-sm bg-zinc-800 text-zinc-200 rounded-tr-sm '>I need some information about your company</div>
                                </div>
                            </div>
                            <div className='flex max-w-[85%] gap-3 flex-row mt-6'>
                                <div className='w-8 h-8  rounded-full flex items-center justify-center shrink-0 border border-white/5'>
                                    <Image src={assets.agent_icon} alt="xyz" className='w-full h-full object-cover rounded-full' />
                                </div>
                                <div className='space-y-1'>
                                    <div className='p-4 rounded-2xl text-sm leading-relaxed sahdow-sm bg-white text-zinc-900 rounded-tl-sm'>ChatBot.AI is a platform that helps businesses to improve their customer support.
                                        using your own data.We Provide 24/7 customer support with new AI features.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='p-4 bg-[#0A0A0E] border-t border-white/10  shrink-0'>
                        <div className='relative'>
                            <div className='min-h-12.5 w-full px-4 py-3 text-sm bg-zinc-900/50 flex items-center justify-between rounded-lg border border-zinc-300/10 '>
                                <span>Type your message here...</span>
                                <button className='h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center'>
                                    <Send className='w-4 h-4 ' />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}

export default ChatBotModel