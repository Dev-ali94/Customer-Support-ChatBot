import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    return (
        <nav
            className="hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[60%] border border-zinc-300/10 bg-black/45 backdrop-blur-md rounded-full" >
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <h2 className="font-momo-signature font-light text-lg text-zinc-200/60">
                    ChatBot.Ai
                </h2>
                <div className="flex items-center gap-8 text-medium font-light text-zinc-400">
                    <Link href="#feature" className="hover:text-white transition-colors duration-300">
                        Features
                    </Link>
                    <Link href="#integration" className="hover:text-white transition-colors duration-300">
                        Integration
                    </Link>
                    <Link href="#feature" className="hover:text-white transition-colors duration-300">
                        Pricing
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/api/auth" className="text-xs font-medium text-zinc-400 border-2 border-zinc-400/60 px-4 py-2 rounded-full hover:text-white transition-colors duration-300">
                        Sign In
                    </Link>
                    <Link href="/api/auth" className="text-xs font-medium text-black bg-white px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors duration-300">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
