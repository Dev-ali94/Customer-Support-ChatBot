import React from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'


const SectionFormField = ({ formData, setFormData, selectedSource, setSelectedSource, knowledgeSource, isLoadingSource, isDisabled }) => {
    const tone_option = [
        {
            value: "strict",
            label: "strict",
            badge: "Fact-Based",
            description: "Only answer if fully confident.No small talk."
        },
        {
            value: "neutral",
            label: "neutral",
            description: "Professional ,concise and direct"
        },
        {
            value: "friendly",
            label: "friendly",
            description: "Warm and conversational.Good for general FAQ."
        },
        {
            value: "empathetic",
            label: "empathetic",
            description: "Support-first ,apologetic and calming"
        }
    ]
    return (
        <>
            <div className='space-y-4'>
                <div className='space-y-3'>
                    <Label className="text-zinc-300">Section Name</Label>
                    <Input
                        placeholder="e.g, Billing Policy"
                        className="bg-white/2 w-full border-white/10 text-white placeholder:text-zinc-600 "
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={isDisabled}
                    />
                </div>
                <div className='space-y-3'>
                    <Label className="text-zinc-300">Description</Label>
                    <Input
                        placeholder="When should the AI use this?"
                        className="bg-white/2 w-full border-white/10 text-white placeholder:text-zinc-600 "
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        disabled={isDisabled}
                    />
                    <p className='text-[11px] text-zinc-500 ml-2'>Used by the routing model to decide when to active this section.</p>
                </div>
                <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                        <h4 className='text-xs font-semibold text-zinc-500 uppercase tracking-wider'>Data Source</h4>
                        <span className='text-xs text-zinc-500'>{selectedSource.length} attached</span>
                    </div>
                    <Select
                        value={selectedSource[0] || ""}
                        onValueChange={(value) => {
                            if (!selectedSource.includes(value)) {
                                setSelectedSource([...selectedSource, value])
                            }
                        }}
                        disabled={isDisabled}>
                        <SelectTrigger className="bg-white/2 border-white/10 text-white">
                            <SelectValue placeholder={isLoadingSource ? "Loading..." : "Select a source"} />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0A0A0E] border-white/10 text-zinc-300">
                            {knowledgeSource.length > 0 ? (
                                knowledgeSource?.map((source) => (
                                    <SelectItem value={source.id} key={source.id}>
                                        <div className='flex items-center gap-3 '>
                                            <span className='text-xs text-zinc-500 capitalize'>[{source.type}]</span>
                                            <span>{source.name}</span>
                                        </div>
                                    </SelectItem>
                                ))
                            ) : (
                                <>
                                    <SelectItem value="none" disabled>
                                        No Knowledge Source Available
                                    </SelectItem>
                                </>
                            )}
                        </SelectContent>
                    </Select>

                    {selectedSource?.length > 0 && (
                        <div className='space-y-4'>
                            {selectedSource?.map((sourceId) => {
                                const source = knowledgeSource?.find((s) => s.id === sourceId)
                                if (!source) return null
                                return <div key={sourceId} className='flex items-center justifiy-between p-2 rounded-md bg-white/5 border border-white/10'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-xs text-zinc-500 capitalize'>{[source.type]}</span>
                                        <span className='text-sm text-zinc-300'>{source.name}</span>
                                        <Button variant='ghost' size="sm" className="h-6 w-6 p-0 text-zinc-500 hover:text-red-500" disabled={isDisabled} onClick={() => setSelectedSource(selectedSource.filter((id) => id !== sourceId))}>
                                            x
                                        </Button>
                                    </div>
                                </div>
                            })}
                        </div>
                    )}
                </div>
                <div className='space-y-3'>
                    <h4 className='text-xs font-semibold text-zinc-500 uppercase tracking-wider'>Tone</h4>
                    <RadioGroup className="grid grid-cols-1 gap-3" value={formData.tone} disabled={isDisabled} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
                        {tone_option.map((option) => (
                            <div key={option.value} className='flex items-center space-x-2 rounded-md border border-white/5 bg-white/1 p-3 hover:bg-white/5 transition-colors'>
                                <RadioGroupItem value={option.value} id={option.value} className="border-white/10 text-indigo-500" />
                                <label htmlFor={option.value} className='flex-1 cursor-pointer'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-zinc-200 font-medium'>
                                            {option.label}
                                        </span>
                                        {option.badge && (
                                            <span className='text-[10px] mt-1 bg-red-500/10 text-red-500 px-1.5 rounded-sm  border border-red-500/10'>{option.badge}</span>
                                        )}
                                    </div>
                                    <span className='text-xs text-zinc-500 font-normal'>{option.description}</span>
                                </label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                <div className='space-y-3'>
                    <h4 className='text-xs font-semibold text-zinc-500 uppercase tracking-wider'>Scope Roles</h4>
                    <div className='grid grid-cols-2 gap-3 '>
                        <div className='space-y-2'>
                            <Label className='text-zinc-300 '>Allowed Topics</Label>
                            <Input
                                placeholder="e.g, Pricing, Refund"
                                className="bg-white/2 w-full border-white/10 text-white placeholder:text-zinc-600 "
                                value={formData.allowedTopics}
                                onChange={(e) => setFormData({ ...formData, allowedTopics: e.target.value })}
                                disabled={isDisabled}
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label className='text-zinc-300 '>Blocked Topics</Label>
                            <Input
                                placeholder="e.g, competitors"
                                className="bg-white/2 w-full border-white/10 text-white placeholder:text-zinc-600 "
                                value={formData.blockedTopics}
                                onChange={(e) => setFormData({ ...formData, blockedTopics: e.target.value })}
                                disabled={isDisabled}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default SectionFormField