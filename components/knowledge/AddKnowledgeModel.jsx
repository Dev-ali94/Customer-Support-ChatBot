import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Alert, AlertDescription } from '../ui/alert'
import { AlertCircle, FileText, Globe2Icon, Loader2Icon, Upload } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'

const AddKnowledgeModel = ({ isOpen, setIsOpen, defaultTab, setDefaultTab, onImport, isLoading, existingSource }) => {
    const [websiteUrl, setWebsiteUrl] = useState("")
    const [docsTitle, setDocsTitle] = useState("")
    const [docsContent, setDocsContent] = useState("")
    const [uploadFile, setUploadFile] = useState(null)
    const [error, setError] = useState(null)
    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => { setIsOpen(open); if (!open) setError(null) }}>
            <DialogContent className="sm:max-w-[600px] bg-[#0E0E12] border-white/10 text-zinc-100 p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Add New Source</DialogTitle>
                    <DialogDescription>Choose a method to add knowledge to your chatbot.</DialogDescription>
                </DialogHeader>
                <Tabs
                    defaultValue={defaultTab}
                    value={defaultTab}
                    onValueChange={(value) => { setDefaultTab(value); setError(null) }}>
                    <div className='px-6 border-b border-white/5'>
                        <TabsList className="bg-transparent h-auto p-0 gap-6">
                            <TabsTrigger value="website" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-0 py-3 text-xs uppercase tracking-wider text-zinc-500 data-[state=active]:text-white transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:outline-none ring-0 outline-none border-t-0 border-x-0">
                                Website
                            </TabsTrigger>

                            <TabsTrigger value="text" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-0 py-3 text-xs uppercase tracking-wider text-zinc-500 data-[state=active]:text-white transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:outline-none ring-0 outline-none border-t-0 border-x-0">
                                Q&A / Text
                            </TabsTrigger>

                            <TabsTrigger value="file" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-0 py-3 text-xs uppercase tracking-wider text-zinc-500 data-[state=active]:text-white transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:outline-none ring-0 outline-none border-t-0 border-x-0">
                                File Upload
                            </TabsTrigger>
                        </TabsList>

                    </div>
                    <div className='p-6 min-h-50 space-y-4'>
                        {error && (
                            <Alert
                                variant="destructive"
                                className='bg-red-500/10 border-red-500/20 text-red-400'>
                                <AlertCircle className='w-4 h-4' />
                                <AlertDescription className="ml-2 text-xs">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        <TabsContent value="website" className="mt-0 space-y-4 animate-in fade-in duration-500">
                            <div className='p-4 rounded-lg bg-indigo-500/10  border border-indigo-500/20 text-indigo-200  tex-sm flex gap-3 '>
                                <Globe2Icon className='w-5 h-5 shrink-0' />
                                <div>
                                    <p className='font-medium'>Crawl Website</p>
                                    <p className='text-xs text-indigo-300/80 mt-1  leading-relaxed'>Add your website URL and let our crawler collect all the content.</p>
                                </div>
                            </div>
                            <div className='space-y-3'>
                                <Label>Website Url <span className='text-sm text-red-500'>*</span></Label>
                                <Input placeholder="https://example.com" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
                            </div>
                        </TabsContent>
                        <TabsContent value="text" className="mt-0 space-y-4 animate-in fade-in duration-500">
                            <div className='p-4 rounded-lg bg-purple-500/10  border border-purple-500/20 text-purple-200  tex-sm flex gap-3 '>
                                <FileText className='w-5 h-5 shrink-0' />
                                <div>
                                    <p className='font-medium'>Raw Text</p>
                                    <p className='text-xs text-purple-300/80 mt-1  leading-relaxed'>Paste your FAQs ,policies,terms and conditions etc.</p>
                                </div>
                            </div>
                            <div className='space-y-3'>
                                <Label>Title <span className='text-sm text-red-500'>*</span></Label>
                                <Input placeholder="e.g, Refund Policy" value={docsTitle} onChange={(e) => setDocsTitle(e.target.value)} />
                            </div>
                            <div className='space-y-3'>
                                <Label>Content <span className='text-sm text-red-500'>*</span></Label>
                                <Textarea className="bg-white/5 border-white/10 h-32 resize-none" placeholder="Past text here...." value={docsContent} onChange={(e) => setDocsContent(e.target.value)} />
                            </div>
                        </TabsContent>
                        <TabsContent
                            value="file"
                            className="mt-0 animate-in fade-in duration-500"
                        >
                            <input
                                type="file"
                                id="csv-file-input"
                                accept=".csv,text/csv"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];

                                    if (file) {
                                        // ✅ Correct 10MB check
                                        if (file.size > 10 * 1024 * 1024) {
                                            setError("File size should be less than 10MB");
                                            return;
                                        }

                                        if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
                                            setError("Please upload a valid CSV file");
                                            return;
                                        }
                                    }

                                    setUploadFile(file);
                                    setError(null);
                                }}
                            />

                            <div onClick={() => document.getElementById("csv-file-input")?.click()}
                                className="group cursor-pointer border-2 border-dashed border-zinc-700 hover:border-zinc-500 transition-all duration-300 rounded-2xl h-60 flex items-center justify-center  bg-zinc-900/40 hover:bg-zinc-800/60 backdrop-blur-md">
                                <div className="flex flex-col items-center justify-center text-center gap-3 p-6 ">
                                    <Upload className="w-8 h-8 text-zinc-400 group-hover:text-zinc-200 transition-colors bg-zinc-600 p-2 rounded-full group-hover:bg-zinc-900" />
                                    <div>
                                        <p className="font-semibold text-zinc-100 text-sm tracking-wide">
                                            {uploadFile ? uploadFile.name : "Upload CSV File"}
                                        </p>

                                        <p className="text-xs text-zinc-400 mt-1">
                                            CSV file only • Max 10MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                    <div className='p-6 border-t border-white/5  bg-blak/20 flex justify-end gap-3'>
                        <Button variant='ghost' onClick={() => setIsOpen(false)} className="text-zinc-400 hover-text-white  hover:bg-white/5 ">Cancel</Button>
                        <Button className={`bg-white min-w-[110px] text-black hover:bg-zinc-200 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>{isLoading ? (<Loader2Icon className='w-4 h-4 mr-2 animate-spin' />) : "Add Knowledge"}</Button>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

export default AddKnowledgeModel
