"use client"
import AddKnowledgeModel from '@/components/knowledge/AddKnowledgeModel'
import QuickAction from '@/components/knowledge/QuickAction'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import React, { useState } from 'react'

const page = () => {
    const [defaultTab, setDefaultTab] = useState("website")
    const [isOpen, setIsOpen] = useState(false)
    const [knowdledegeStoringLoader, setKnowdledegeStoringLoader] = useState(false)
    const [knowdledegeSourceLoader, setKnowdledegeSourceLoader] = useState(true)
    const [KnowledgeSource, setKnowledgeSource] = useState([])
    const openModel = (tab) => {
        setDefaultTab(tab)
        setIsOpen(true)
    }
    const handelImportSource = async (params) => {
        setKnowdledegeStoringLoader(true)
        try {
            let response

            if (params.type === "file" && params.file) {
                const formData = new FormData()
                formData.append("file", params.file)
                formData.append("type", params.type)

                response = await fetch("/api/knowledge/store", {
                    method: "POST",
                    body: formData
                })
            } else {
                response = await fetch("/api/knowledge/store", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(params)
                })
            }

            if (!response.ok) {
                throw new Error("Failed to store")
            }

            const res = await fetch("/api/knowledge/fetch")
            const newData = await res.json()

            setKnowledgeSource(newData.sources) // 🔥 you also had wrong setter here
            setIsOpen(false)

        } catch (error) {
            console.log(error)
        } finally {
            setKnowdledegeStoringLoader(false)
        }
    }

    return (
        <div className='p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <div>
                    <h1 className='text-2xl font-semibold text-white tracking-tight'>Knowledge Base</h1>
                    <p className='text-sm tex-zinc-400 mt-1'>Manage your website sources, documents, upload here</p>
                </div>
                <div className='flex items-center gap-2'>
                    <Button
                        onClick={() => openModel("website")}
                        className="bg-white text-black hover:bg-gray-200"
                    >
                        <PlusIcon className='w-4 h-4 mr-2' />
                        Add Knowledge
                    </Button>
                </div>
            </div>
            <QuickAction onOpenModel={openModel} />
            <AddKnowledgeModel isOpen={isOpen} setIsOpen={setIsOpen} defaultTab={defaultTab}
                setDefaultTab={setDefaultTab} onImport={handelImportSource}
                isLoading={knowdledegeStoringLoader} existingSource={KnowledgeSource} />
        </div>
    )
}

export default page