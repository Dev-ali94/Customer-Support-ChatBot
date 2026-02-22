"use client"
import React, { useEffect, useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import ApperanceConfig from '@/components/chatbot/ApperanceConfig'
import ChatSimulator from '@/components/chatbot/ChatSimulator'
import EmbedCodeConfig from '@/components/chatbot/EmbedCodeConfig'
import { ScrollArea } from '@/components/ui/scroll-area'


const page = () => {
    const [chatBotData, setChatBotData] = useState(null)
    const [section, setSection] = useState([])
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [activeSection, setActiveSection] = useState(null)
    const scrollViewRef = useRef(null)
    const [primaryColor, setPrimaryColor] = useState("#4f46e5")
    const [welcomeMessage, setWelcomeMessage] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    // Scroll to bottom
    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isTyping])

    // Fetch chatbot data on mount
    useEffect(() => {
        const fetchChatBotData = async () => {
            try {
                const res = await fetch("/api/chatbot/data/fetch")
                const data = await res.json()
                if (data?.data) {
                    setChatBotData(data.data)
                    setPrimaryColor(data.data.color || "#4f46e5")
                    setWelcomeMessage(data.data.welcome_message || "Hi there, how can I help you today?")
                    setMessages([
                        {
                            role: "assistant",
                            content: data.data.welcome_message || "Hi there, how can I help you today?",
                            isWelcome: true,
                            section: null,
                        }
                    ])
                }

                const response = await fetch("/api/sections/fetch")
                if (response.ok) {
                    const sectionData = await response.json()
                    setSection(sectionData.sections || [])
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchChatBotData()
    }, [])

    const handelSend = async () => {
        try {
            if (!input.trim()) return
            const currentSection = section.find((s) => s.name === activeSection)
            const sourceIds = currentSection?.source_ids || []
            const userMsg = { role: "user", content: input, section: activeSection }
            setMessages((prev) => [...prev, userMsg])
            setInput("")
            setIsTyping(true)
            const res = await fetch("/api/chat/test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMsg],
                    knowledge_source_ids: sourceIds
                })
            })
            if (res.ok) {
                const data = await res.json()
                setMessages((prev) => [...prev, { role: "assistant", content: data.response, section: null }])
                setIsTyping(false)
            }
        } catch (error) {
            console.log(error)
        }
    }
    // Handle Save
    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await fetch("/api/chatbot/data/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    color: primaryColor,
                    welcome_message: welcomeMessage
                })
            })

            if (res.ok) {
                const updated = await res.json()
                toast.success("Chatbot updated successfully")
                setChatBotData(updated.data)
                setPrimaryColor(updated.data.color || "#4f46e5")
                setWelcomeMessage(updated.data.welcome_message || "")
            } else {
                const err = await res.json()
                toast.error(err.error || "Failed to update")
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to update chatbot")
        } finally {
            setIsSaving(false)
        }
    }

    const hasChanges = chatBotData
        ? primaryColor !== (chatBotData.color || "#4f46e5") ||
        welcomeMessage !== (chatBotData.welcome_message || "Hi there, how can I help you today?")
        : false

    const handleSectionClick = (sectionName) => {
        setActiveSection(sectionName)
        const userMessage = { role: "user", content: sectionName, section: null }
        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsTyping(null)

        setTimeout(() => {
            const aiMessage = {
                role: "assistant",
                content: `You can ask me any question related to this ${sectionName}`
            }
            setMessages((prev) => [...prev, aiMessage])
        }, 800)
    }

    const HandleReset = () => {
        setActiveSection(null)
        setInput("")
        setIsTyping(false)
        if (welcomeMessage) {
            setMessages([
                {
                    role: "assistant",
                    content: welcomeMessage,
                    isWelcome: true,
                    section: null,
                },
            ])
        }
    }

    return (
        <>
            <Toaster />
            <div className='p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto h-[calc(100vh-64px)] overflow-hidden flex flex-col'>
                <div className='flex items-center justify-between shrink-0'>
                    <div>
                        <h1 className='text-2xl font-semibold text-white tracking-tight'>ChatBot Playground</h1>
                        <p className='text-zinc-400 text-sm mt-1'>Test your chatbot and customize, deploy it.</p>
                    </div>
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0'>
                    <div className='lg:col-span-7 flex flex-col h-full min-h-0 space-y-4'>
                        <ChatSimulator
                            messages={messages}
                            primaryColor={primaryColor}
                            section={section}
                            input={input}
                            setInput={setInput}
                            activeSection={activeSection}
                            isTyping={isTyping}
                            scrollRef={scrollViewRef}
                            handleSend={handelSend}
                            handleKeyDown={() => { }}
                            handleSectionClick={handleSectionClick}
                            handleReset={HandleReset}
                        />
                    </div>
                    <div className='lg:col-span-5 h-full min-h-0 overflow-hidden flex flex-col '>
                        <ScrollArea className="h-full pr-4">
                            <div className='space-y-6 pb-8'>
                                <ApperanceConfig
                                    primaryColor={primaryColor}
                                    setPrimaryColor={setPrimaryColor}
                                    welcomeMessage={welcomeMessage}
                                    setWelcomeMessage={setWelcomeMessage}
                                    handleSave={handleSave}
                                    isSaving={isSaving}
                                    hasChanges={hasChanges}
                                />
                                <EmbedCodeConfig chatBotId={chatBotData?.id} />
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page