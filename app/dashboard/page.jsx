"use client"
import React, { useEffect, useState } from 'react'
import OnBoarding from '@/components/dashboard/OnBoarding'
import { Loader2Icon } from 'lucide-react'

const Page = () => {
    const [businessDetailAvilable, setBusinessDetailAvilable] = useState(false)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const businessDetail = async () => {
            const response = await fetch("/api/business/fetch")
            const data = await response.json()
            setBusinessDetailAvilable(data.success)
            setLoading(false)
        }
        businessDetail()
    }, [])
    if (loading) {
        return (
            <div className='flex items-center justify-center w-full h-screen'>
                <Loader2Icon className='text-zinc-400 w-10 h-10 animate-spin' />
            </div>
        )
    }
    return (
        <div className='flex flex-1 w-full'>
            {!businessDetailAvilable ? (
                <div className="flex items-center justify-center w-full p-4 min-h-screen">
                    <OnBoarding />
                </div>
            ) : (
                <> hellow world</>
            )}

        </div>
    )
}

export default Page
