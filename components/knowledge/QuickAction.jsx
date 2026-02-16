import React from 'react'
import { Button } from '../ui/button'
import { File, Globe2Icon, UploadIcon } from 'lucide-react'

const QuickAction = ({ onOpenModel }) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            <Button
                variant='outline'
                className="h-auto py-8 px-6 flex flex-col items-center justify-center gap-2 border-white/5 bg-[#0A0A0E] hover:bg-white/2  hover:border-indigo-500/30  transition-all hover:text-white group whitespace-normal"
                onClick={() => onOpenModel("website")}
            >
                <div className='p-3 rounded-full bg-indigo-500/30 border border-indoigo-500/20 group-hover:bg-indigo-500/20 transition-colors'>
                    <Globe2Icon className='w-6 h-6 text-indigo-400' />
                </div>
                <div className='space-y-1 text-center w-full'>
                    <span className='text-sm font-medium block whitespace-normal'>
                        Add Website
                    </span>
                    <p className='text-xs font-noraml text-zinc-500 leading-relaxed'>Crawl your website or specific page to keep your website sync with your chatbot.</p>
                </div>
            </Button>
            <Button
                variant='outline'
                className="h-auto py-8 px-6 flex flex-col items-center justify-center gap-2 border-white/5 bg-[#0A0A0E] hover:bg-white/2  hover:border-emerald-500/30  transition-all hover:text-white group whitespace-normal"
                onClick={() => onOpenModel("upload")}
            >
                <div className='p-3 rounded-full bg-emerald-500/30 border border-indoigo-500/20 group-hover:bg-emerald-500/20 transition-colors'>
                    <UploadIcon className='w-6 h-6 text-emerald-400' />
                </div>
                <div className='space-y-1 text-center w-full'>
                    <span className='text-sm font-medium block whitespace-normal'>
                        Upload file
                    </span>
                    <p className='text-xs font-noraml text-zinc-500 leading-relaxed'>Upload PDF, TXT, DOCX, CSV, and more to add it as a knowledge source for your chatbot.</p>
                </div>
            </Button>
            <Button
                variant='outline'
                className="h-auto py-8 px-6 flex flex-col items-center justify-center gap-2 border-white/5 bg-[#0A0A0E] hover:bg-white/2  hover:border-zinc-500/30  transition-all hover:text-white group whitespace-normal"
                onClick={() => onOpenModel("upload")}
            >
                <div className='p-3 rounded-full bg-zinc-500/30 border border-indoigo-500/20 group-hover:bg-zinc-500/20 transition-colors'>
                    <File className='w-6 h-6 text-zinc-400' />
                </div>
                <div className='space-y-1 text-center w-full'>
                    <span className='text-sm font-medium block whitespace-normal'>
                        Manual text
                    </span>
                    <p className='text-xs font-noraml text-zinc-500 leading-relaxed'>Add custom text or copy paste content to use as a knowledge source for your chatbot.</p>
                </div>
            </Button>
        </div>
    )
}

export default QuickAction