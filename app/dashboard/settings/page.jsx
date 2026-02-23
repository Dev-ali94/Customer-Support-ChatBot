"use client"
import TeamSection from '@/components/settings/TeamSection'
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
        </div>
    )
}

export default page