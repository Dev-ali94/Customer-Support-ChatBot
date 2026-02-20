"use client"
import SectionFormField from '@/components/sections/SectionFormField'
import SectionsTabel from '@/components/sections/SectionsTabel'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'


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
        fallbackbehavior: ""
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
            blockedTopics: ''
        })
        setSheetOpen(true)
    }
    const handelSaveSection = async () => {
        if (!formData.name.trim()) {
            toast.error("Section name is required")
            return
        }
        if (!formData.description.trim()) {
            toast.error("Section description is required")
            return
        }
        if (selectedSource.length === 0) {
            toast.error("At least one knowledge source is required")
            return
        }
        setIsSaving(true)
        try {
            const sectionData = { ...formData, sourceId: selectedSource, status: "active" }
            const response = await fetch("/api/sections/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sectionData)
            })
            await fetchSections()
            setSheetOpen(false)

        } catch (error) {
            console.log(error);
            toast.error("Failed to create section")
        } finally {
            setIsSaving(false)
        }
    }
    const fetchSections = async () => {
        try {
            setIsLoadingSection(true)
            const res = await fetch("/api/sections/fetch")
            const data = await res.json()

            const transformSection = data.sections.map((section) => ({
                id: section.id,
                name: section.name,
                sourceCount: section.source_ids?.length || 0,
                source_ids: section.source_ids || [],
                description: section.description,
                tone: section.tone,
                allowedTopics: section.allowed_topics,
                blockedTopics: section.blocked_topics,
                scopeLabel: section.allowed_topics || "general",
                status: section.status
            }))
            setSection(transformSection)
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch sections")
        } finally {
            setIsLoadingSection(false)
        }
    }
    const handlePreviewSection = (section) => {
        setSelectedSection(section)

        setFormData({
            name: section.name || "",
            description: section.description || "",
            tone: section.tone || "neutral",
            allowedTopics: section.allowedTopics || "",
            blockedTopics: section.blockedTopics || "",
            fallbackbehavior: "escalate"
        })

        setSelectedSource(section.source_ids || [])
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
        fetchSections()
    }, [])
    const handleDeleteSection = async () => {
        if (!selectedSection || selectedSection.id === "new") return
        try {
            setIsSaving(true)
            const response = await fetch("/api/sections/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: selectedSection.id })
            })
            toast.success("section deleted successfully.")

            await fetchSections()
            setSheetOpen(false)
            setSelectedSection(null)
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete section")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <>
            <Toaster />
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
                        <SectionsTabel sections={section} isLoading={isLoadingSection} onPreview={handlePreviewSection} onCreateSection={handleCreateSection} />
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
                                        <Button onClick={handelSaveSection} variant='ghost' size='icon' className="w-full bg-white text-black hover:bg-zinc-200 shadow-none">
                                            {isSaving ? "Creating...." : "Create Section"}
                                        </Button>
                                    </div>
                                )}
                                {selectedSection.id !== "new" && (
                                    <div className='p-6 bg-red-500/5 border-t border-red-500/10'>
                                        <h5 className='text-xs font-medium text-red-400 mb-1'>Danger Zone</h5>
                                        <p className='text-xs text-red-500/70 mb-3'>Deleting the section remove all assciated routing rules.</p>
                                        <Button onClick={handleDeleteSection} variant='destructive' className="w-full bg-red-500/10 text-red-500 hover:bg-red-500/30">{isSaving ? "Deleting...." : "Delete"}</Button>
                                    </div>
                                )}
                            </>
                        )}

                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}

export default page