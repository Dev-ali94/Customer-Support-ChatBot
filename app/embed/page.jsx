'use client';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Button } from '@base-ui/react';
import { AlertCircle, Bot, ChevronDown, Send } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

const Page = () => {
    const searchParams = useSearchParams();
    const token = searchParams?.get("token") || "";

    const [metaData, setMetaData] = useState(null);
    const [sections, setSections] = useState([]);
    const [activeSection, setActiveSection] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState([]);
    const [input, setInput] = useState("");

    const scrollRef = useRef(null);

    // Safe browser-only logic
    useEffect(() => {
        if (typeof window === "undefined") return;

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

    // Fetch widget config
    useEffect(() => {
        if (!token) {
            setError("Missing Session Token");
            setLoading(false);
            return;
        }

        const fetchConfig = async () => {
            try {
                const res = await fetch(`/api/widget/config?token=${token}`);
                if (!res.ok) throw new Error("Failed to load widget");

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
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    const primaryColor = metaData?.color || "#4f46e5";

    const toggleOpen = () => {
        const newState = !isOpen;
        setIsOpen(newState);

        window.parent.postMessage(
            {
                type: "resize",
                width: newState ? "380px" : "60px",
                height: newState ? "520px" : "60px",
                borderRadius: newState ? "12px" : "30px",
            },
            "*"
        );
    };

    const handleSend = async () => {
        if (!input.trim() || !token) return;

        const userMsg = {
            role: "user",
            content: input,
            section: activeSection,
        };

        setMessage((prev) => [...prev, userMsg]);
        setInput("");

        try {
            const res = await fetch("/api/chat/public", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    messages: [...message, userMsg],
                }),
            });

            const data = await res.json();

            setMessage((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.response || "Something went wrong",
                },
            ]);
        } catch (err) {
            console.log(err);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Loading
    if (loading) return null;

    // Error state
    if (error && isOpen) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#050509] text-red-500">
                <AlertCircle className="w-10 h-10 mb-2" />
                <p>{error}</p>
            </div>
        );
    }

    // Closed widget (floating button)
    if (!isOpen) {
        return (
            <button
                onClick={toggleOpen}
                style={{ backgroundColor: primaryColor }}
                className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
            >
                <Bot className="w-6 h-6" />
            </button>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-[#0A0A0E] overflow-hidden">

            {/* Header */}
            <div className="h-14 flex items-center justify-between px-4 border-b border-white/5 bg-[#0E0E12]">
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <Bot className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-sm text-white">Support</p>
                        <p className="text-xs text-gray-400">Online</p>
                    </div>
                </div>

                <button onClick={toggleOpen}>
                    <ChevronDown className="w-4 h-4 text-white" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                {message.map((msg, i) => (
                    <div key={i} className="mb-3">
                        <div
                            className={cn(
                                "p-3 rounded-xl text-sm max-w-[80%]",
                                msg.role === "user"
                                    ? "ml-auto bg-zinc-800 text-white"
                                    : "bg-white text-black"
                            )}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/5">
                <div className="flex gap-2">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type message..."
                        className="flex-1"
                    />

                    <Button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        style={
                            input.trim()
                                ? { backgroundColor: primaryColor }
                                : {}
                        }
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Page;