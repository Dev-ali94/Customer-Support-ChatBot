import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Loader2Icon, Plus, ShieldAlert } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { cn } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'


const TeamSection = () => {
    const [team, setTeam] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [newMemberEmail, setNewMemberEmail] = useState("")
    const [newMemberName, setNewMemberName] = useState("")
    const [openDialog, setOpenDialog] = useState(false)
    const [memberToDelete, setMemberToDelete] = useState(null)

    const fetchTeam = async () => {
        try {
            const response = await fetch("/api/team/fetch")
            const data = await response.json()
            if (response.ok) {
                setTeam(data.team)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchTeam()
    }, [])
    const handelAddMember = async () => {
        setIsAdding(true)
        try {
            const res = await fetch("/api/team/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: newMemberEmail, name: newMemberName })
            })
            if (res.ok) {
                setNewMemberEmail("")
                setNewMemberName("")
                setOpenDialog(false)
                fetchTeam()
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsAdding(false)
        }
    }
    return (
        <Card className='border-white/5 bg-[#0a0a0e]'>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-base text-white font-medium">Team Member</CardTitle>
                    <CardDescription>Manage your team members and their permissions</CardDescription>
                </div>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button variant='ghost' icon='sm' className="bg-white text-black hover:bg-zinc-200">
                            <Plus className="w-4 h-4" />
                            Add Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0E0E12] border-white/10 text-white sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Team Member</DialogTitle>
                            <DialogDescription className="text-zinc-300">Add your team members to the workspace immediately</DialogDescription>
                        </DialogHeader>
                        <div className='grid py-4 gap-4'>
                            <div className='grid gap-2'>
                                <Label htmlFor="name" className="text-zinc-300">Name</Label>
                                <Input id="name" placeholder="Jhone Doe" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} className="bg-white/5 border-white/10 text-white" />
                            </div>
                            <div className='grid gap-2'>
                                <Label htmlFor="email" className="text-zinc-300">Email</Label>
                                <Input id="email" placeholder="example@gmail.com" value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} className="bg-white/5 border-white/10 text-white" />
                            </div>
                            <DialogFooter>
                                <Button variant='outline' onClick={() => setOpenDialog(false)}
                                    className="border-white/10 text-zinc-300 bg-white/5 hover:bg-white/10 hover:text-white"
                                >
                                    cancel
                                </Button>
                                <Button className="bg-white text-black  hover:bg-zinc-200" onClick={handelAddMember} disabled={isAdding}>{isAdding ? "Adding..." : "Add Member"}</Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <div className='space-y-6'>
                    {isLoading ? (
                        <div className='flex items-center justify-center'>
                            <Loader2Icon className='h-8 w-8 animate-spin text-zinc-400' />
                        </div>
                    ) : (
                        team.length === 0 ? (
                            <h2 className='text-center py-4 text-zinc-500 text-xs'>No team members found</h2>
                        ) : (
                            <div className='grid gap-4'>

                                <div className='flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/1 hover:bg-white/2 transition-colors '>
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-white/10 bg-transparent">
                                                <TableHead className="text-xs font-medium text-zinc-400 uppercase">Name</TableHead>
                                                <TableHead className="text-xs font-medium text-zinc-400 uppercase">Email</TableHead>
                                                <TableHead className="text-xs font-medium text-zinc-400 uppercase">Role</TableHead>
                                                <TableHead className="text-xs font-medium text-zinc-400 uppercase">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isLoading ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="h-48 text-center">
                                                        <div className='flex items-center justify-center gap-2'>
                                                            <Loader2Icon className='h-5 w-5  animate-spin text-zinc-400' />
                                                            <span className='font-medium text-zinc-400'>Loading team member...</span>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                team?.length > 0 ? team.map((member) => (
                                                    <TableRow key={member.id} className="border-white/5 bg-transparent group">
                                                        <TableCell className="text-zinc-200 font-medium">
                                                            <div className='flex items-center gap-2'>
                                                                <Avatar className="w-9 h-9 border border-white/10">
                                                                    <AvatarFallback className="bg-black/40 text-zinc-400">
                                                                        {member.name?.slice(0, 1).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <p className='text-sm font-medium text-white mb-1 '>{member.name}</p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-zinc-200 ml-1 font-medium">{member.user_email} <span className='text-zinc-200'>sources</span></TableCell>
                                                        <TableCell><Badge variant='secondary' className={cn("capitalize mx-1 border", member.status === "member" ? "bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20")}>
                                                            {member.role}
                                                        </Badge></TableCell>
                                                        <TableCell>
                                                            <Badge variant='secondary' className={cn("capitalize mx-1 border", member.status === "active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20")}>
                                                                {member.status}
                                                            </Badge>
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
                                    </Table>

                                </div>

                            </div>
                        )
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default TeamSection