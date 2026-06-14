'use client';
import { ButtonGroup } from '@/components/ui/button-group';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Button } from '@base-ui/react';
import { AlertCircle, Bot, ChevronDown, MessageCircle, Send } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState, Suspense } from 'react';

const page = () => {
    const searchparams = useSearchParams();
    const token = searchparams.get("token");
    const [metaData, setMetaData] = useState(null);
    const [sections, setSections] = useState([]);
    const [activeSection, setIsActiveSection] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        document.body.style.backgroundColor = "transparent";
        document.documentElement.style.backgroundColor = "transparent";
        window.parent.postMessage(
            {
                type: "resize",
                width: "60px",
                height: "60px",
                borderRadius: "30px",
            },
            "*"
        );
    }, []);

    useEffect(() => {
        if (!token) {
            setError("Missing Session Token");
            setLoading(false);
            return;
        }

        const fetchConfig = async () => {
            try {
                const res = await fetch(`/api/widget/config?token=${token}`);
                if (!res.ok) throw new Error("Failed to load widget configuration");
                const data = await res.json();
                setMetaData(data.metadata);
                setSections(data.sections || []);
                setMessage([
                    {
                        role: "assistant",
                        content:
                            data.metadata?.welcome_message ||
                            "Hi there! I'm here to help you",
                        isWelcome: true,
                    },
                ]);
            } catch (err) {
                console.error(err);
                setError("Failed to load widget");
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, [token]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [message, isOpen, isTyping]);
    const toggleOpen = () => {
        const newState = !isOpen;
        setIsOpen(newState);

        if (newState) {
            window.parent.postMessage(
                {
                    type: "resize",
                    width: "380px",
                    height: "520px",
                    borderRadius: "12px",
                },
                "*"
            );
        } else {
            window.parent.postMessage(
                {
                    type: "resize",
                    width: "60px",
                    height: "60px",
                    borderRadius: "30px",
                },
                "*"
            );
        }
    };

    const primaryColor = metaData?.color || "#4f46e5";

    if (loading) return null;
    if (error && isOpen) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#050509] border border-red-500/30 text-red-500/60 text-white">
                <AlertCircle className="w-10 h-10 mb-2 text-red-500/60" />
                <p>{error}</p>
            </div>
        );
    }
    if (!isOpen) {
        return (
            <button onClick={toggleOpen} style={{ backgroundColor: primaryColor }}
                className='w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:brightness-110 transition-all text-white'>
                <Bot className='w-7 h-7' />
            </button>
        )
    }
    const handleSend = async () => {
        if (!input.trim() || !token) return
        const currentSection = sections.find((s) => s.name === activeSection)
        const sourceIds = currentSection?.source_ids || []
        const userMsg = { role: "user", content: input, section: activeSection }
        setMessage((prev) => [...prev, userMsg])
        setInput("")
        setIsTyping(false)
        try {
            const res = await fetch("/api/chat/public", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    messages: [...message, userMsg],
                    knowledge_source_id: sourceIds
                })
            })
            if (res.ok) {
                const data = await res.json()
                setMessage((prev) => [...prev, { role: "assistant", content: data.response, section: null }])
            } else {
                setMessage((prev) => [...prev, { role: 'assistant', content: 'Sorry, I am facing some issue write now try later', section: null }])
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsTyping(false)
        }
    }
    const handelSectionClick = (sectionName) => {
        setIsActiveSection(sectionName);
        const userMsg = { role: "user", content: sectionName, section: null }
        setMessage((prev) => [...prev, userMsg])
        setInput("")
        setIsTyping(true)
        setTimeout(() => {
            const aiMsg = {
                role: "assistant",
                content: `You can ask me any question related to this ${sectionName}`,
                section: sectionName
            }
            setMessage((prev) => [...prev, aiMsg])
        }, 800)
    }
    const handelKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }
    return (
        <div className='flex flex-col h-screen bg-[#0A0A0E] overflow-hidden shadow-2xl'>
            <div className='h-15 border-b border-white/5 flex items-center justify-between px-4 bg-[#0E0E12] shadow-xl shrink-0 z-20'>
                <div className='flex items-center gap-3'>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>
                        <Bot className="w-4 h-4" />
                    </div>
                    <div className='flex flex-col items-start justify-center mt-2 gap-1'>
                        <h1 className='text-sm font-semibold text-white leading-none'>Support</h1>
                        <span className='text-[11px] text-gray-400/90 font-medium'>Online</span>
                    </div>
                </div>
                <button onClick={toggleOpen} aria-label='Minimize Chat' className='p-2 text-zinc-400 hover:bg-white/20 rounded-lg transition-colors'>
                    <ChevronDown className='w-4 h-4' />
                </button>
            </div>
            <div className='flex min-h-0 overflow-y-auto bg-zinc-950/30 p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent'>
                <div className='space-y-6 pb-4'>
                    {message.map((msg, index) => (
                        <div key={index} className={cn("flex w-full flex-col", msg.role === "user" ? "items-end" : "items-start")}>
                            <div className={cn("flex max-w-[85%] gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                                {msg.role !== "user" && (
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>
                                        <Bot className="w-4 h-4" />
                                    </div>
                                )}
                                <div className='space-y-2'>
                                    <div className={cn("p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm", msg.role === "user" ? "bg-zinc-800 text-bg-zinc-100 rounded-tr-sm" : "bg-white text-zinc-900 rounded-tl-sm")}>
                                        {msg.content}
                                    </div>
                                    {msg.isWelcome && sections.length > 0 && (
                                        <div className='flex flex-wrap gap-2 pt-1 ml-1 animate-in fade-in slide-in-from-top-1 duration-400'>
                                            {sections.map((section) => (
                                                <button
                                                    key={section.id}
                                                    onClick={() => handelSectionClick(section.name)}
                                                    className='px-3 py-1.5 rounded-full border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700  hover:border-zinc-600 text-xs font-medium transition-all'
                                                >
                                                    {section.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='p-4 bg-[#0a0a0e] border-t border-white/5 shrink-0 z-20'>
                <div className='relative'>
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handelKeyDown}
                        disabled={!activeSection}
                        placeholder={activeSection ? "Type a message....." : "Select a topic above......"}
                        className="min-h-50px max-h-120px pr-20 outline-none text-white bg-zinc-900/50 border-white/10 resize-none rounded-xl disabled:opacity-70 disabled:cursor-not-allowed placeholder:text-zinc-600 focus:ring-1 focus:ring-white/10"
                    />
                    <Button
                        size='icon'
                        onClick={handleSend}
                        disabled={!activeSection || !input.trim()}
                        className={cn("absolute -bottom-1 right-2 h-8 w-8 transition-colors",
                            (!activeSection || !input.trim()) ? "bg-zinc-800 text-zinc-500" : ""
                        )}
                        style={activeSection && input.trim() ? { backgroundColor: primaryColor, color: "white" } : {}}
                    >
                        <Send className='w-4 h-4' />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default page 