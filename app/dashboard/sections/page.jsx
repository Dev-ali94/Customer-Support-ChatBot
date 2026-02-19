"use client"
import SectionFormField from '@/components/sections/SectionFormField'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const page = () => {
    const [sheetOpen, setSheetOpen] = useState(false)
    const [selectedSection, setSelectedSection] = useState(null)
    const [knowledgeSource, setKnowledgeSource] = useState([])
    const [selectedSource, setSelectedSource] = useState([])
    const [isLoadingSource, setIsLoadingSource] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [section, setSection] = useState([])
    const [isLoadingSection, setIsLoadingSection] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        tone: 'neutral',
        allowedTopics: '',
        blockedTopics: '',
        fallbackBehaviour: 'escalate'
    })
    const handleCreateSection = () => {
        setSelectedSection({
            id: "new",
            name: "",
            description: "",
            sourceCount: 0,
            tone: 'neutral',
            scopeLabel: "",
            status: "draft"
        })
        setSelectedSource([])
        setFormData({
            name: '',
            description: '',
            tone: 'neutral',
            allowedTopics: '',
            blockedTopics: '',
            fallbackBehaviour: 'escalate'
        })
        setSheetOpen(true)
    }
    const isPreviewMode = selectedSection?.id !== "new"
    useEffect(() => {
        const fetchKnowledgeSource = async () => {
            const res = await fetch("/api/knowledge/fetch")
            const data = await res.json()
            setKnowledgeSource(data.sources)
            console.log(data.sources);
            setIsLoadingSection(false)
        }
        fetchKnowledgeSource()
    }, [])
    const handelSave = () => {

    }
    return (
        <div className='p-8 space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold text-white'>Sections</h1>
                    <p className='text-zinc-400 mt-1'>Manage your knowledge base sections</p>
                </div>
                <Button variant='ghost' onClick={handleCreateSection} className="bg-white text-black hover:bg-zinc-200">
                    <Plus className='w-4 h-4 mr-1' />
                    Create Section
                </Button>
            </div>
            <Card className="border-white/5 bg-[#0a0a0E]">
                <CardContent className="p-0">

                </CardContent>
            </Card>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent className="w-full sm:max-w-lg border-l border-white/10 bg-[#0A0A0E] p-0 shadow-lg flex flex-col h-full">
                    {selectedSection && (
                        <>
                            <SheetHeader className="p-6 border-b border-white/5">
                                <SheetTitle className="text-xl text-white">
                                    {selectedSection.id === "new" ? "Create Section" : "View Section"}
                                </SheetTitle>
                                <SheetDescription className="text-zinc-500">
                                    {selectedSection.id === "new" ? "Configure how the AI behaves for this specific topics." : "Review section configraution and data source."}
                                </SheetDescription>
                            </SheetHeader>
                            <div className='flex-1 overflow-y-auto px-6 py-0 space-y-6'>
                                <SectionFormField
                                    formData={formData}
                                    setFormData={setFormData}
                                    selectedSource={selectedSource}
                                    setSelectedSource={setSelectedSource}
                                    knowledgeSource={knowledgeSource}
                                    isLoadingSource={isLoadingSource}
                                    isDisabled={isPreviewMode}
                                />
                            </div>
                            {selectedSection.id === "new" && (
                                <div className='p-6 border-t border-white/5'>
                                    <Button onClick={handelSave} variant='ghost' size='icon' className="w-full bg-white text-black hover:bg-zinc-200 shadow-none">
                                        {isSaving ? "Creating...." : "Create Section"}
                                    </Button>
                                </div>
                            )}
                            {selectedSection.id !== "new" && (
                                <div className='p-6 bg-red-500/5 border-t border-red-500/10'>
                                    <h5 className='text-xs font-medium text-red-400 mb-1'>Danger Zone</h5>
                                    <p className='text-xs text-red-500/70 mb-3'>Deleting the section remove all assciated routing rules.</p>
                                    <Button variant='destructive' className="w-full bg-red-500/10 text-red-500 hover:bg-red-500/30">{isSaving ? "Deleting...." : "Delete"}</Button>
                                </div>
                            )}
                        </>
                    )}

                </SheetContent>
            </Sheet>
        </div>
    )
}

export default page