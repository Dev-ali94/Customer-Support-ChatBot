import { ArrowRight, ArrowRightIcon, Check, CheckIcon, Copy, FileText, Globe2Icon, Loader2, Plus, Upload } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

const DashboardOverview = () => {
    const [data, setData] = useState(null)
    const [copied, setCopied] = useState(false)
    const [loading, setLoading] = useState(true)
    const [origin, setOrigin] = useState("")
    useEffect(() => {
        setOrigin(window.location.origin)
        fetch("/api/overview")
            .then((res) => res.json())
            .then((d) => { setData(d); setLoading(false); console.log(d); })
            .catch((error) => { console.log(error); setLoading(false) })
    }, [])
    const handleCopyCode = () => {
        setCopied(true)
        navigator.clipboard.writeText(`<script src="http://localhost:3000/widget.js" data-id="${data?.botId}" defer></script>`)
        setTimeout(() => {
            setCopied(false)
        }, 2000)
    }
    if (loading) {
        return (
            <div className='flex items-center justify-center w-full h-full text-zinc-500'>
                <Loader2 className='w-8 h-8 animate-spin' />
            </div>
        )
    }
    if (!data) return null
    const { knowledge, sections, chats, counts } = data
    const setupSteps = [
        {
            label: "Website Scanned",
            complete: true,
            href: "#"
        },
        {
            label: "Knowledge Add",
            complete: counts.knowledge > 0,
            href: "/dashboard/knowledge"
        },
        {
            label: "Section Configured",
            complete: counts.sections > 0,
            href: "/dashboard/sections"
        },
        {
            label: "Widget Installed",
            complete: counts.conversation > 0,
            href: "#widget"
        }
    ]

    return (
        <div className='p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300'>
            <section className='space-y-4'>
                <h3 className='text-lg font-medium text-white'>Setup progress</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    {setupSteps.map((step, index) => (
                        <Link key={index} href={step.href} className='block group'>
                            <Card className={cn("border-white/5 bg-white/2 hover:bg-white/4 transition-colors", step.complete ? "opacity-60" : "border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10")}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <span className={cn("text-xs font-medium", step.complete ? "text-zinc-200" : "text-white")}>{step.label}</span>
                                    {step.complete ? (<Check className='w-4 h-4 text-emerald-300' />) : (<ArrowRight className='w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform' />)}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>
            <div className='grid grid-col-1 lg:grid-cols-3 gap-8'>
                <div className='lg:col-span-2 space-y-8'>
                    <Card className="border-white/5 bg-[#0A0A0E]">
                        <CardHeader className="flex items-center justify-between mb-2">
                            <CardTitle className="text-base font-medium text-white">Knowledge Base</CardTitle>
                            <Button variant='outline' size='sm' asChild className="h-8 text-zinc-400 text-xs border-white/10 bg-transparent ">
                                <Link href="/dashboard/knowledge">Manage Sources</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="grid grid-cols-3 gap-4 ">
                            <div className='p-3 rounded-lg bg-white/2 border border-white/5'>
                                <div className='flex items-center gap-2 mb-1'>
                                    <Globe2Icon className="w-4 h-4 text-blue-400" />
                                    <span className='text-xs text-zinc-500 font-medium'>Pages</span>
                                </div>
                                <span className='text-2xl font-semibold text-white'>{knowledge.website}</span>
                            </div>
                            <div className='p-3 rounded-lg bg-white/2 border border-white/5'>
                                <div className='flex items-center gap-2 mb-1'>
                                    <FileText className="w-4 h-4 text-purple-400" />
                                    <span className='text-xs text-zinc-500 font-medium'>Manual Text</span>
                                </div>
                                <span className='text-2xl font-semibold text-white'>{knowledge.text}</span>
                            </div>

                            <div className='p-3 rounded-lg bg-white/2 border border-white/5'>
                                <div className='flex items-center gap-2 mb-1'>
                                    <Upload className="w-4 h-4 text-emerald-400" />
                                    <span className='text-xs text-zinc-500 font-medium'>File Uploaded</span>
                                </div>
                                <span className='text-2xl font-semibold text-white'>{knowledge.uploads}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-white/5 bg-[#0A0A0E] min-h-90">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className='space-y-1'>
                                <CardTitle className="text-base font-medium text-white">Sections</CardTitle>
                                <CardDescription>Configure behaviour for different topic</CardDescription>
                            </div>
                            <Button size='sm' asChild className="h-8 gap-1 bg-white text-black hover:bg-zinc-200 ">
                                <Link href="/dashboard/sections"><Plus className='w-3 h-3 ml-1' /> Create Section</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className='divide-y divide-white/5'>
                                {sections.length === 0 ? (
                                    <div className='p-6 text-center text-xs text-zinc-500'>
                                        No Section Configure yet
                                    </div>
                                ) : (
                                    <>
                                        <div className='grid grid-cols-12 gap-4 px-6 py-4 bg-white/2 text-[10px] text-zinc-500 uppercase tracking-wider font-medium'>
                                            <div className='col-span-5'>Name</div>
                                            <div className='col-span-3'>Sources</div>
                                            <div className='col-span-3'>Tone</div>
                                        </div>
                                        {sections?.list?.map((section, index) => (
                                            <div
                                                className='grid grid-cols-12 gap-4 px-4 py-6 border-b border-white/5 items-center hover:bg-white/2 transition-colors last:border-0 group'
                                                key={index}>
                                                <div className='col-span-5 text-xs font-medium text-zinc-200'>{section.name}</div>
                                                <div className='col-span-3 text-xs font-medium text-zinc-200'>{section.sourceCount} sources</div>
                                                <div className='col-span-3'>
                                                    <Badge variant='secondary' className='bg-white/5 text-zinc-400 hover:bg-white/10 border-white/5 rounded-lg'>{section.tone}</Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className='space-y-8'>
                    <Card className='bg-[#0A0A0E] min-h-80 border-white/5'>
                        <CardHeader className="pb-1">
                            <div className='flex items-center justify-between'>
                                <CardTitle className="text-base font-medium text-white">Recent Chats</CardTitle>
                                <Link className='text-sm text-zinc-500 hover:text-white transition-colors flex items-center ' href="/dashboard/conversations">view all<ArrowRightIcon className='w-3 h-3 ml-1.5' /></Link>
                            </div>
                        </CardHeader>
                        <CardContent className="px-2 pb-2">
                            <div className='space-y-4'>
                                {chats.length === 0 ? (
                                    <div className='p-4 text-xs text-center text-zinc-500'>No chats yet</div>
                                ) : (
                                    chats.map((chat, index) => (
                                        <Link href="/dashboard/conversations" key={index} className='block p-3 rounded-lg hover:bg-white/3 transition-colors group'>
                                            <div className='flex items-start justify-between mb-1'>
                                                <span className='text-xs font-medium text-zinc-200 group-hover:text-white transition-colors'>{chat.title}</span>
                                                <span className='text-[10px] text-zinc-600 whitespace-nowrap ml-2'>{chat.time}</span>
                                            </div>
                                            <p className='text-xs text-zinc-500 line-clamp-1'>{chat.snippet}</p>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-white/5 bg-[#0A0A0E]" id="widget">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-medium text-white">
                                Install Widget
                            </CardTitle>
                            <CardDescription>
                                Add this snippet to your website's appropriate page.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-0">
                            <div className="relative">
                                <div className="rounded-lg border border-white/10 bg-[#050509] p-4 pr-14">
                                    <code className="block whitespace-pre-wrap break-all text-sm font-mono text-zinc-400">
                                        {`<script src="http://localhost:3000/widget.js" data-id="${data?.botId}"defer></script>`}
                                    </code>
                                </div>

                                <Button
                                    size="icon"
                                    onClick={handleCopyCode}
                                    variant="secondary"
                                    className="absolute right-3 top-3 h-8 w-8 bg-white/60"
                                >
                                    {copied ? (
                                        <CheckIcon className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default DashboardOverview