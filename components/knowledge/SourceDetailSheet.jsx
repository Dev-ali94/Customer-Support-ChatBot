import React from 'react'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet'
import { getStatusBadge, getTypeIcon } from './KnowledgeTable'
import { Button } from '../ui/button'

function SourceDetailSheet({ open, setOpen, source }) {
    if (!source) return null
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="w-full sm:max-w-md border-l border-white/10 bg-[#0a0A0E] p-0 shadow-2xl">
                <div className='flex flex-col h-full'>
                    <SheetHeader className="p-6 border-b border-white/5">
                        <SheetTitle className="text-xl text-white flex items-center gap-3">
                            {getTypeIcon(source.type)}
                            {source.name}
                        </SheetTitle>
                        <SheetDescription className="text-zinc-500 ml-7">{source.source_url || "manualy added"}</SheetDescription>
                        <div className='pt-2 flex gap-2 ml-7'>
                            {getStatusBadge(source.status)}
                            <h2 className="capitalize text-zinc-400 mb-1"><span className='text-zinc-500 ml-1'>Updated At: </span>{source.updated_at && new Date(source.updated_at).toLocaleString()}</h2>
                        </div>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <h4 className='text-xs font-medium text-zinc-300  uppercase tracking-wide'>Preview Content</h4>
                        <div className='p-4 rounded-lg border border-white/5 bg-black/40 font-mono text-xs text-zinc-400 h-72  overflow-y-auto leading-relaxed'>{source.content || "No content available" || source.name}</div>
                    </div>
                    <SheetFooter className="p-6 border-t border-white/5 bg-[#050509]">
                        <Button variant='destructive' className="w-full bg-red-500/10 text-red-500 hover:bg-red-500/30">Delete Source</Button>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default SourceDetailSheet