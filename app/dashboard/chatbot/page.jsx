"use client"
import ChatSimulator from '@/components/chatbot/ChatSimulator'
import React, { useEffect, useRef, useState } from 'react'

const page = () => {
    const [chatBotData, setChatBotData] = useState(null)
    const [section, setSection] = useState([])
    const [Loading, setLoading] = useState(false)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [activeSection, setActiveSection] = useState(null)
    const scrollViewRef = useRef(null)
    const [primaryColor, setPrimaryColor] = useState("#4f46e5")
    const [welcomeMessage, setWelcomeMessage] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isTyping])
    useEffect(() => {
        const fetchChatBotData = async () => {
            const res = await fetch("/api/chatbot/data/fetch")
            const data = await res.json()
            if (data) {
                setPrimaryColor(data.color || "#4f46e5")
                setWelcomeMessage(
                    data.welcome_message || "Hi there, how can I help you today?"
                )

                setMessages([
                    {
                        role: "assistant",
                        content:
                            data.welcome_message ||
                            "Hi there, how can I help you today?",
                        isWelcome: true,
                        section: null,
                    },
                ])
            }
            const response = await fetch("/api/sections/fetch")
            if (response.ok) {
                const data = await response.json()
                console.log(data)
                setSection(data.sections || [])
            }
        }

        fetchChatBotData()
    }, [])
    const handleSend = () => {

    }
    const handleKeyDown = () => {

    }
    const handleSectionClick = (sectionName) => {
        setActiveSection(sectionName)
        const userMessage = { role: "user", content: sectionName, section: null }
        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsTyping(null)
        setTimeout(() => {
            const aiMessage = {
                role: "assistent",
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
        <div className='p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto h-[calc(100vh-64px)] overflow-hidden flex flex-col'>
            <div className='flex items-center justify-between shrink-0'>
                <div>
                    <h1 className='text-2xl font-semibold text-white tracking-tight'>ChatBot Playground</h1>
                    <p className='text-zinc-400 text-sm mt-1'>Test your chatbot and customize ,deploy it.</p>
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
                        handleSend={handleSend}
                        handleKeyDown={handleKeyDown}
                        handleSectionClick={handleSectionClick}
                        handleReset={HandleReset}
                    />
                </div>
            </div>
        </div>
    )
}

export default page 