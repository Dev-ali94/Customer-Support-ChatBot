"use client"
import TeamSection from '@/components/settings/TeamSection'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'

const page = () => {
    const [organizationData, setOrganizationData] = useState()
    useEffect(() => {
        const fetchOrganizationData = async () => {
            try {
                const response = await fetch("/api/organization/fetch")
                const data = await response.json()
                setOrganizationData(data.organization)

            } catch (error) {
                console.log(error);
            }
        }
        fetchOrganizationData()

    }, [])
    return (
        <div className='p-6 md:p-8 space-y-8 max-w-5xl mx-auto'>
            <div>
                <h1 className='text-3xl font-bold text-white'>Settings</h1>
                <p className='text-zinc-400 mt-1'>Manage your worksapce prefrence ,billing ,policiy.</p>
            </div>
            <Card className="border-white/5 bg-[#0A0A0E]">
                <CardHeader>
                    <CardTitle className="text-base font-medium text-white">Manage your workspace</CardTitle>
                    <CardDescription>General setting for your workspace</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className='grid md:grid-cols-2 gap-3 '>
                        <div className='space-y-2'>
                            <Label className="text-zinc-500">Worksapce Name</Label>
                            <div className='p-3 rounded-md bg-white/5 border-white/5 text-zinc-300 text-sm'>{organizationData?.business_name}</div>
                        </div>
                        <div className='space-y-2'>
                            <Label className="text-zinc-500">Primary Website</Label>
                            <div className='p-3 rounded-md bg-white/5 border-white/5 text-zinc-300 text-sm'>{organizationData?.website_url}</div>
                        </div>
                    </div>
                    <div className='grid gap-4 md:grid-cols-2'>
                        <div className='space-y-2 text-white'>
                            <Label className="text-zinc-500">Default Language</Label>
                            <div className='p-3 rounded-md bg-white/5 border-white/5 text-zinc-300 text-sm'>English</div>
                        </div>
                        <div className='space-y-2 text-white'>
                            <Label className="text-zinc-500">Timezone</Label>
                            <div className='p-3 rounded-md bg-white/5 border-white/5 text-zinc-300 text-sm'>UTC (GMT+0)</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <TeamSection />
            <Card className="border-red-500/20 bg-red-500/5">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-red-500">
                        Danger Zone
                    </CardTitle>
                    <CardDescription className="text-red-400/70">
                        Be careful when using these features
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="flex items-center justify-between gap-6 rounded-lg border border-red-500/10 bg-black/30 p-4">

                        {/* Left Side */}
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-zinc-200">
                                Delete Workspace
                            </p>
                            <p className="text-xs text-zinc-500 max-w-md">
                                Permanently delete your workspace and all of its data.
                                This action cannot be undone.
                            </p>
                        </div>

                        {/* Right Side */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                                >
                                    Delete
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent className="bg-zinc-900 border border-red-500/20">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-white">
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-zinc-400">
                                        This action cannot be undone. This will permanently delete your
                                        workspace and remove all associated data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700">
                                        Cancel
                                    </AlertDialogCancel>

                                    <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                                        Delete Workspace
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default page