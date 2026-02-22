import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '../ui/button'
import { Bot, RefreshCcw, Send, User } from 'lucide-react'
import { ScrollArea } from '../ui/scroll-area'
import { cn } from '@/lib/utils'
import { Input } from '../ui/input'

const ChatSimulator = ({
    messages,
    primaryColor,
    section,
    input,
    setInput,
    activeSection,
    isTyping,
    scrollRef,
    handleSend,
    handleKeyDown,
    handleSectionClick,
    handleReset
}) => {
    return (
        <Card className="flex-1 flex flex-col border-white/5 bg-[#0A0A0E] overflow-hidden relative shadow-lg">
            {/* Header */}
            <div className="border-b border-white/5 flex items-center justify-between px-6 py-3 -mt-6 bg-[#0E0E12]">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-zinc-300">Test Environment</span>
                </div>
                <Button
                    variant='ghost'
                    className="h-8 text-zinc-800 hover:text-black bg-white"
                    size='sm'
                    onClick={handleReset}
                >
                    <RefreshCcw className='w-4 h-4 mr-1' />
                    Reset
                </Button>
            </div>

            {/* Chat area */}
            <ScrollArea className="flex-1 p-6 relative bg-zinc-950/30 overflow-auto">
                <div className='pb-6 space-y-6'>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex flex-col w-full",
                                message.role === "user" ? "items-end" : "items-start"
                            )}
                        >
                            <div className={cn(
                                "flex max-w-[80%] gap-3",
                                message.role === "user" ? "flex-row-reverse" : "flex-row"
                            )}>
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5",
                                        message.role === "user" ? "bg-zinc-800" : "text-white"
                                    )}
                                    style={message.role === "user" ? {} : { backgroundColor: primaryColor }}
                                >
                                    {message.role === "user"
                                        ? <User className='w-4 h-4 text-zinc-400' />
                                        : <Bot className='w-4 h-4 text-white' />}
                                </div>

                                <div className='space-y-2'>
                                    <div className={cn(
                                        "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                                        message.role === "user"
                                            ? "bg-zinc-800 text-zinc-200 rounded-tr-sm"
                                            : "bg-white text-zinc-800 rounded-tl-sm"
                                    )}>
                                        {message.content}
                                    </div>

                                    {/* Section buttons below welcome message */}
                                    {message.isWelcome && section.length > 0 && (
                                        <div className='flex flex-wrap gap-2  ml-1 animate-in fade-in slide-in-from-top-1 duration-500'>
                                            {section.map((s) => (
                                                <Button
                                                    key={s._id}
                                                    variant='ghost'
                                                    className="h-8 rounded-full text-zinc-600 hover:text-black bg-white/8 border border-white/10"
                                                    size='sm'
                                                    onClick={() => handleSectionClick(s.name)}
                                                >
                                                    {s.name}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="flex w-full justify-start">
                            <div className='flex max-w-[80px] gap-3 flex-row'>
                                <div
                                    className='w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5'
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <Bot className='w-4 h-4 text-white ' />
                                </div>
                                <div className='p-4 rounded-2xl bg-white text-zinc-900 rounded-tl-sm shadow-sm flex items-center gap-1'>
                                    <div className='w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animate-delay:-0.3s]' />
                                    <div className='w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animate-delay:-0.15s]' />
                                    <div className='w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce' />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            <div className='p-4 bg-[#0A0A0E] border-t border-white/5'>
                <div className='relative'>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={!activeSection}
                        placeholder={activeSection ? "Type your message..." : "Select a section to start"}
                        className="min-h-[60px] max-h-[160px] outline-none text-white bg-zinc-900/50 border-white/10 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed -mb-5"
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
        </Card>
    )
}

export default ChatSimulator