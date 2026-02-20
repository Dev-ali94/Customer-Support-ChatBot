import { getToneBadge } from '@/assets/assets'
import { getStatusBadge } from '@/components/knowledge/KnowledgeTable'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2Icon, ShieldAlert } from 'lucide-react'
import React from 'react'

function SectionsTabel({ sections, isLoading, onPreview, onCreateSection }) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="border-white/5 bg-transparent">
                    <TableHead className="text-xs uppercase font-medium text-zinc-400">name</TableHead>
                    <TableHead className="text-xs uppercase font-medium text-zinc-400">sources</TableHead>
                    <TableHead className="text-xs uppercase font-medium text-zinc-400">scope</TableHead>
                    <TableHead className="text-xs uppercase font-medium text-zinc-400">status</TableHead>
                    <TableHead className="text-xs uppercase font-medium text-zinc-400">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-48 text-center">
                            <div className='flex items-center justify-center gap-2'>
                                <Loader2Icon className='h-5 w-5  animate-spin text-zinc-400' />
                                <span className='font-medium text-zinc-400'>Loading sections...</span>
                            </div>
                        </TableCell>
                    </TableRow>
                ) : (
                    sections?.length > 0 ? sections.map((section) => (
                        <TableRow key={section.id} className="border-white/5 bg-transparent group">
                            <TableCell className="text-zinc-200 font-medium">{section.name}</TableCell>
                            <TableCell className="text-zinc-200 ml-1 font-medium">{section.sourceCount} <span className='text-zinc-200'>sources</span></TableCell>
                            <TableCell>{getToneBadge(section.tone)}</TableCell>
                            <TableCell>{getStatusBadge(section.status)}</TableCell>
                            <TableCell className="text-start">
                                <Button variant='ghost' size='sm' className="h-7 text-white font-sm  cursor-pointer hover:text-white bg-white/20 hover:bg-white/5" onClick={() => onPreview(section)}>Preview</Button>
                            </TableCell>
                        </TableRow>

                    )) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-48 text-center">
                                <div className='flex items-center justify-center gap-2'>
                                    <ShieldAlert className='w-5 h-5 text-zinc-300' />
                                    <span className='font-medium text-zinc-400'>please create your fist section.</span>
                                </div>

                            </TableCell>
                        </TableRow>
                    )
                )}
            </TableBody>
        </Table >
    )
}

export default SectionsTabel