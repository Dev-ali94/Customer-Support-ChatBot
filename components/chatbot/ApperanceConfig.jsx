import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { PaletteIcon, SaveIcon } from 'lucide-react'
import { Label } from '../ui/label'
import { cn } from '@/lib/utils'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'

const ApperanceConfig = ({ primaryColor, setPrimaryColor, welcomeMessage, setWelcomeMessage, handleSave, isSaving, hasChanges }) => {
    const preset_color = [
        { name: "Indigo", value: "#6366F1" },
        { name: "Red", value: "#EF4444" },
        { name: "Blue", value: "#3B82F6" },
        { name: "Green", value: "#22C55E" },
        { name: "Purple", value: "#A855F7" },
        { name: "Pink", value: "#EC4899" },
        { name: "Teal", value: "#14B8A6" },
        { name: "Cyan", value: "#06B6D4" },
        { name: "Emerald", value: "#10B981" },
        { name: "Rose", value: "#F43F5E" }
    ];

    return (
        <Card className="border-white/5 bg-[#0a0a0e]">
            <CardHeader className='pb-3'>
                <div className='flex items-center gap-3'>
                    <PaletteIcon className='w-4 h-4 text-zinc-500' />
                    <CardTitle className="text-sm font-medium text-white uppercase">Appearance</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className='space-y-3'>
                    <Label className="text-zinc-300">Primary Color</Label>
                    <div className='grid grid-cols-10 gap-3'>
                        {preset_color.map((color) => (
                            <button
                                key={color.name}
                                onClick={() => setPrimaryColor(color.value)}
                                className={cn("w-6 h-6 rounded-full border transition-all", primaryColor === color.value ? "ring-2 ring-white ring-offset-2 ring-offset-[#0A0A0E] scale-102" : "opacity-60 hover:opacity-100")}
                                style={{ backgroundColor: color.value, borderColor: color.value }}
                                title={color.name}
                            />
                        ))}
                        <div className='relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/70'>
                            <input type='color' value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className='absolute -top-2 -left-2 w-10 h-10 p-0 border-0 cursor-pointer' />
                        </div>
                    </div>
                </div>
                <div className='space-y-3'>
                    <Label className="text-zinc-300">Welcome Message</Label>
                    <Textarea
                        value={welcomeMessage}
                        onChange={(e) => setWelcomeMessage(e.target.value)}
                        placeholder="Hello, I can help you today?"
                        className="bg-white/2 border-white/10 text-white resize-none text-sm "
                    />
                </div>
                {hasChanges && (
                    <Button
                        variant="ghost"
                        disabled={isSaving}
                        onClick={handleSave}
                        className="w-full bg-white text-black hover:bg-zinc-200 "
                    >
                        {isSaving ? "Saving..." : <><SaveIcon className='w-4 h-4 mr-1' />Save Changes</>}
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}

export default ApperanceConfig