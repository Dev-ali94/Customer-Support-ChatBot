import React, { useEffect, useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'


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
            if (data.ok) {
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
        </Card>
    )
}

export default TeamSection