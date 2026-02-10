import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <div className='border-t border-white/5 py-7 bg-black/10'>
            <div className='max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6'>
                <h2 className="font-momo-signature font-light text-lg text-zinc-200/60">
                    ChatBot.Ai
                </h2>
                <div className='flex gap-8 text-sm text-zinc-600 font-light'>
                    <Link href="#" className='hover:text-zinc-400 transition-colors'>
                        Privacy Policy
                    </Link>
                    <Link href="#" className='hover:text-zinc-400 transition-colors'>
                        Terms of Service
                    </Link>
                    <Link href="#" className='hover:text-zinc-400 transition-colors'>
                        Contact Us
                    </Link>
                </div>
                <div className='text-xs text-zinc-700'>@ 2026.All rights reserved</div>
            </div>
        </div>
    )
}

export default Footer