import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { File, FilterIcon, Globe2Icon, Search, Upload } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Skeleton } from '../ui/skeleton'
import { Badge } from '../ui/badge'

export const getTypeIcon = (type) => {
    switch (type) {
        case "website":
            return <Globe2Icon className="w-4 h-4 text-blue-400" />;
        case "file":
            return <Upload className="w-4 h-4 text-emerald-400" />;
        case "text":
            return <File className="w-4 h-4 text-zinc-400" />;
        default:
            return null;
    }
}

export const getStatusBadge = (status) => {
    switch (status) {
        case "active":
            return <Badge variant="default" className="bg-emerald-500/20 text-emerald-500 shadow-none">Active</Badge>;
        case "error":
            return <Badge variant="default" className="bg-red-500/20 text-red-500 shadow-none">Error</Badge>;
        case "training":
            return <Badge variant="default" className="bg-amber-500/20 text-amber-500 shadow-none">Training</Badge>;
        case "excluded":
            return <Badge variant="default" className="bg-zinc-500/20 text-zinc-500 shadow-none">Excluded</Badge>;
        default:
            return null;
    }
}
const KnowledgeTable = ({ source, onSourceClick, isLoading }) => {

    return (
        <Card className="border-white/5 bg-[#0a0a0e]">
            <CardHeader className="pb-4">
                <div className='flex items-center justify-between'>
                    <CardTitle className="text-base font-medium text-white">Sources</CardTitle>
                    <div className='flex items-center gap-3'>
                        <div className='relative'>
                            <Search className='absolute top-2.5 left-2.5 h-4 w-4 text-zinc-500 ' />
                            <Input className="pl-9 h-9 w-[200px] md:w-[300px] bg-white/2 border-white/10 text-sm" placeholder="Search sources..." />
                        </div>
                        <Button variant='ghost' size='icon' className="text-zinc-400 hover:text-white hover:bg-white/5"><FilterIcon className='w-4 h-4' /></Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-6">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/5 hover:bg-transparent ">
                            <TableHead className="text-xs uppercase font-medium text-zinc-400">Name</TableHead>
                            <TableHead className="text-xs uppercase font-medium text-zinc-400">Type</TableHead>
                            <TableHead className="text-xs uppercase font-medium text-zinc-400">Status</TableHead>
                            <TableHead className="text-xs uppercase font-medium text-zinc-400">Last updated</TableHead>
                            <TableHead className="text-xs uppercase font-medium text-zinc-400">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="border-white/5">
                                    <TableCell><Skeleton className="h-5 w-32 bg-white/5" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32 bg-white/5" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32 bg-white/5" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32 bg-white/5" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32 bg-white/5" /></TableCell>
                                </TableRow>
                            ))
                        ) : source.length > 0 ? (
                            source.map((source, index) => (
                                <TableRow key={index} className="border-white/5  cursor-pointer group transition-colors" onClick={() => onSourceClick(source)}>
                                    <TableCell className="font-medium text-zinc-200 group-hover:text-white">
                                        <div className='flex items-center gap-3'>
                                            {getTypeIcon(source.type)}
                                            <div className='flex flex-col'>
                                                <span className=''>{source.name}</span>
                                                {source.source_url && (
                                                    <span className='text-zinc-400 text-xs font-normal'>{source.source_url}</span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="capitalize text-zinc-400">{source.type}</TableCell>
                                    <TableCell className="capitalize text-zinc-400">{getStatusBadge(source.status)}</TableCell>
                                    <TableCell className="capitalize text-zinc-400">{source.updated_at && new Date(source.updated_at).toLocaleString()}</TableCell>
                                    <TableCell className="text-start"><Button variant='ghost' size='sm' className="h-7 text-white font-sm  cursor-pointer hover:text-white bg-white/20 hover:bg-white/5">View</Button></TableCell>
                                </TableRow>
                            ))
                        ) : (<TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-zinc-500">
                                No Knowledge Source Found Yet.
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default KnowledgeTable