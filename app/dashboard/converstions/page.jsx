'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { time } from 'drizzle-orm/mysql-core'
import { Bot, Loader2, MessageSquare, MoreHorizontal, Search, Send, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const page = () => {
    const [converstions, setConversations] = useState([])
    const [selectedId, setSelectedId] = useState(null)
    const [curentMessage, setCurrentMessage] = useState([])
    const [isLoadingList, setIsLoadingList] = useState(true)
    const [isLoadingMessage, setIsLoadingMessage] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [replayContent, setReplayContent] = useState("")
    const [isSending, setIsSending] = useState(false)
    const filterConversation = converstions.filter((c) =>
        c.user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const selectedConv = converstions?.find((c) => c.id === selectedId)
    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const res = await fetch("/api/conversations")
                const data = await res.json()
                setConversations(data.conversations || [])
            } catch (error) {
                console.log("Failed to fetch conversation", error);
            } finally {
                setIsLoadingList(false)
            }
        }
        fetchConversation()
    }, [])
    useEffect(() => {
        if (!selectedId) return
        const fetchMessages = async () => {
            setIsLoadingMessage(true)
            try {
                const res = await fetch(`/api/conversations/${selectedId}/messages`)
                const data = await res.json()
                setCurrentMessage(data.messages || [])
            } catch (error) {
                console.log("Failed to fetch conversation", error);
            } finally {
                setIsLoadingMessage(false)
            }
        }
        fetchMessages()
    }, [selectedId])
    const handelSendReplay = async () => {
        if (!replayContent.trim() || !selectedId) return;
        setIsSending(true)
        try {
            const res = await fetch(`/api/conversations/${selectedId}/replay`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ content: replayContent })
            })
            if (res.ok) {
                const newMsg = {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: replayContent,
                    created_at: new Date().toISOString()
                }
                setCurrentMessage((prev) => [...prev, newMsg])
                setReplayContent("")
                setConversations((prev) => prev.map((c) =>
                    c.id === selectedId ? { ...c, lastMessage: replayContent, time: 'Just now' } : c
                ))

            }
        } catch (error) {
            console.error("Failed to replay", error)
        } finally {
            setIsSending(false)
        }
    }
    return (
        <div className='flex h-[calc(100vh-64px)] overflow-hidden bg-black animate-in fade-in duration-300'>
            <div className='w-[350px] md:w-[400px] flex flex-col border-r border-white/5 bg-[#050509]'>
                <div className='p-4 border-b border-white/5 space-y-5'>
                    <div className='flex items-center justify-between'>
                        <h1 className='font-semibold text-white'>Inbox</h1>
                        <div className='text-xs text-zinc-500'>{filterConversation.length} Conversation</div>
                    </div>
                    <div className='relative'>
                        <Search className='absolute top-2.5 left-2.5 w-4 h-4 text-zinc-500' />
                        <Input className="pl-9 bg-[#0A0A0E] border-white/10 text-sm outline-none text-white resize-none rounded-lg disabled:opacity-70 disabled:cursor-not-allowed placeholder:text-zinc-500 focus:ring-1 focus:ring-indigo-500" placeholder="search....." value={searchQuery} onChange={(e) => setSearchQuery()} />
                    </div>
                </div>
                <ScrollArea className="flex-1 px-3 py-3">
                    <div className="flex flex-col gap-2">
                        {isLoadingList ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
                            </div>
                        ) : filterConversation.length === 0 ? (
                            <div className="py-10 text-sm text-center text-zinc-500">
                                No Conversation found
                            </div>
                        ) : (
                            filterConversation.map((conversation) => (
                                <button
                                    key={conversation.id}
                                    onClick={() => setSelectedId(conversation.id)}
                                    className={cn(
                                        "relative w-full rounded-xl px-4 py-3 text-left transition-all duration-200",
                                        "border-l-2 hover:bg-white/5 hover:border-l-indigo-500/50",
                                        selectedId === conversation.id
                                            ? "bg-white/5 border-l-indigo-500 shadow-sm"
                                            : "border-l-transparent"
                                    )}
                                >
                                    <div className="flex flex-col gap-1.5 w-full">
                                        <div className="flex items-center justify-between gap-3">
                                            <span
                                                className={cn(
                                                    "max-w-[180px] truncate text-sm font-medium",
                                                    selectedId === conversation.id
                                                        ? "text-white"
                                                        : "text-zinc-300"
                                                )}
                                            >
                                                {conversation.user}
                                            </span>

                                            <span className="shrink-0 text-[10px] text-zinc-500">
                                                {conversation.time}
                                            </span>
                                        </div>

                                        <span className="w-full line-clamp-1 text-xs text-zinc-500">
                                            {conversation.lastMessage}
                                        </span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>
            <div className='flex-1 flex flex-col min-w-0  bg-[#0a0a0e]'>
                {selectedConv ? (
                    <>
                        <div className='h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0a0a0e]'>
                            <div className='flex items-center gap-3'>
                                <div className='flex items-center justify-center w-8 h-8 rounded-full bg-white/20'>
                                    <User className='w-4 h-4 text-zinc-400' />
                                </div>
                                <div className='flex items-center gap-2'>
                                    <h2 className='font-medium tetx-white text-sm'>{selectedConv.user}</h2>
                                    {selectedConv.visitor_ip && (
                                        <span className='text-xs text-zinc-600 bg-zinc-900 px-1.5 py-0.5 rounded-md'>
                                            {selectedConv.visitor_ip}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <Button variant='ghost' size='icon' className="h-8 w-8 text-zinc-400">
                                <MoreHorizontal className='w-4 h-4' />
                            </Button>
                        </div>
                        <ScrollArea className="flex-1 p-6">
                            {isLoadingMessage ? (
                                <div className='flex items-center justify-center p-10'>
                                    <Loader2 className='w-5 h-5 text-zinc-500 animate-spin' />
                                </div>
                            ) : (
                                <div className='max-w-3xl mx-auto space-y-6'>
                                    {curentMessage.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={cn("flex w-full gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
                                        >
                                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5", msg.role === "user" ? "bg-zinc-800" : "bg-indigo-600 text-white")}>
                                                {msg.role === "user" ? (
                                                    <User className='w-4 h-4 text-white' />
                                                ) : (
                                                    <Bot className='w-4 h-4' />
                                                )}
                                            </div>
                                            <div className={cn("flex flex-col gap-1 max-w-[70%]", msg.role === "user" ? "items-end" : "items-start")}>
                                                <div className={cn("p-3 rounded-lg text-sm leading-relaxed", msg.role === "user" ? "bg-zinc-800 text-zinc-200" : "bg-[#050509] border border-white/5 text-zinc-300")}>{msg.content}</div>
                                                <span className='text-[10px] text-zinc-600 px-1'>
                                                    {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                        <div className='p-4 border-t border-white/5 bg-[#0e0e12]'>
                            <div className='flex gap-2 max-w-3xl mx-auto'>
                                <Input className="bg-zinc-900/5 border-white/10 text-zinc-200 placeholder:text-zinc-600" value={replayContent} onChange={(e) => setReplayContent(e.target.value)} placeholder="Type your replay...." disabled={isSending} />
                                <Button
                                    size='icon' disabled={!replayContent.trim() || isSending}
                                    onClick={handelSendReplay}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    {isSending ? (<Loader2 className='w-4 h-4 animate-spin' />) : (<Send className='w-4 h-4' />)}
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='flex flex-1 flex-col gap-2 items-center justify-center text-zinc-500'>
                        <MessageSquare className='w-8 h-8 text-zinc-600' />
                        <p>Select a conversation to view detail</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default page