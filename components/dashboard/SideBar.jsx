"use client"
import { useState, useEffect } from "react"
import { useUser } from '@/hooks/useUser'
import { cn } from '@/lib/utils'
import { BookOpen, Bot, Layers2Icon, LayoutDashboard, MessageSquare, Settings2Icon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function SideBar() {
    const navLinks = [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Knowledge", href: "/dashboard/knowledge", icon: BookOpen },
        { label: "Sections", href: "/dashboard/sections", icon: Layers2Icon },
        { label: "ChatBot", href: "/dashboard/chatbot", icon: Bot },
        { label: "Converstions", href: "/dashboard/converstions", icon: MessageSquare },
        { label: "Settings", href: "/dashboard/settings", icon: Settings2Icon },
    ]

    const pathName = usePathname()
    const { email } = useUser()

    const [businessDetails, setBusinessDetail] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchBusinessDetails = async () => {
            setLoading(true)
            try {
                const response = await fetch("/api/business/fetch")
                const res = await response.json()
                setBusinessDetail(res.data) // adjust based on your API
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchBusinessDetails()
    }, [])

    return (
        <aside className='w-64 border-r border-white/5 bg-[#050509] fixed h-screen top-0 left-0 flex-col z-40 hidden md:flex'>
            <div className='h-16 flex items-center px-5 border-b border-white/5'>
                <h2 className="font-momo-signature font-light text-lg text-zinc-200/60">
                    ChatBot.Ai
                </h2>
            </div>
            <nav className='flex-1 p-4 space-y-1 overflow-y-auto'>
                {navLinks.map((link) => {
                    const isActive = pathName === link.href
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center px-3 py-2 rounded-md gap-3 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-white/5 text-white"
                                    : "text-zinc-400 hover:bg-white/5"
                            )}
                        >
                            <link.icon className='w-4 h-4' />
                            {link.label}
                        </Link>
                    )
                })}
            </nav>

            <div className='p-4 border-t border-white/5'>
                <div className='flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 cursor-pointer transition-colors group'>
                    <div className='w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5'>
                        <span className='text-xs text-zinc-400 group-hover:text-white'>
                            {businessDetails?.business_name?.slice(0, 1)?.toUpperCase() || ""}
                        </span>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium text-zinc-300 truncate group-hover:text-white">
                            {loading ? "Loading..." : `${businessDetails?.business_name} Workspace`}
                        </span>
                        <span className="text-xs text-zinc-500 truncate">{email}</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default SideBar
