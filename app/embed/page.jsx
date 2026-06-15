'use client';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Button } from '@base-ui/react';
import { AlertCircle, Bot, ChevronDown, MessageCircle, Send } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState, Suspense } from 'react';

const page = () => {
    const {searchparams} = useSearchParams();
    const token = searchparams?.get("token");
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
 <div className="flex flex-col h-screen bg-[#0A0A0E] overflow-hidden shadow-2xl">
    {/* Header */}
    <div className="h-15 border-b border-white/5 flex items-center justify-between px-4 bg-[#0E0E12] shadow-xl shrink-0 z-20">
        <div className="flex items-center gap-3">
            <div
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: primaryColor }}
            >
                <Bot className="w-5 h-5" />
            </div>

            <div className="flex flex-col items-start justify-center mt-2 gap-1">
                <h1 className="text-sm font-semibold text-white leading-none">
                    Support
                </h1>
                <span className="text-[11px] text-gray-400/90 font-medium">
                    Online
                </span>
            </div>
        </div>

        <button
            onClick={toggleOpen}
            aria-label="Minimize Chat"
            className="p-2 text-zinc-400 hover:bg-white/20 rounded-lg transition-colors"
        >
            <ChevronDown className="w-4 h-4" />
        </button>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto bg-zinc-950/30 p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="flex flex-col gap-6">
            {message.map((msg, index) => (
                <div
                    key={index}
                    className={cn(
                        "flex w-full flex-col",
                        msg.role === "user" ? "items-end" : "items-start"
                    )}
                >
                    <div
                        className={cn(
                            "flex max-w-[85%] gap-3",
                            msg.role === "user"
                                ? "flex-row-reverse"
                                : "flex-row"
                        )}
                    >
                        {msg.role !== "user" && (
                            <div
                                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <Bot className="w-5 h-5" />
                            </div>
                        )}

                        <div className="space-y-2">
                            <div
                                className={cn(
                                    "p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm break-words",
                                    msg.role === "user"
                                        ? "bg-zinc-800 text-zinc-100 rounded-tr-sm"
                                        : "bg-white text-zinc-900 rounded-tl-sm"
                                )}
                            >
                                {msg.content}
                            </div>

                            {msg.isWelcome && sections.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1 ml-1 animate-in fade-in slide-in-from-top-1 duration-400">
                                    {sections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() =>
                                                handelSectionClick(section.name)
                                            }
                                            className="px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 hover:border-zinc-600 text-xs font-medium transition-all"
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

    {/* Input */}
    <div className="shrink-0 border-t border-white/5 bg-[#0A0A0E] p-4">
        <div className="relative">
            <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handelKeyDown}
                disabled={!activeSection}
                placeholder={
                    activeSection
                        ? "Type a message..."
                        : "Select a topic above..."
                }
                className="
                    min-h-[52px]
                    max-h-[120px]
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-white/10
                    bg-zinc-900/50
                    py-3
                    pl-4
                    pr-16
                    text-sm
                    text-white
                    placeholder:text-zinc-500
                    outline-none
                    focus:ring-1
                    focus:ring-indigo-500
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                "
            />

          <Button
  size="icon"
  onClick={handleSend}
  disabled={!activeSection || !input.trim()}
  className={cn(
    "absolute right-3 bottom-2 flex h-9 w-9 items-center justify-center rounded-lg transition-all",
    !activeSection || !input.trim()
      ? "bg-zinc-700 text-zinc-400"
      : "text-white"
  )}
  style={
    activeSection && input.trim()
      ? { backgroundColor: primaryColor }
      : {}
  }
>
  <Send className="h-4 w-4" />
</Button>
        </div>
    </div>
</div>
    )
}

export default page 