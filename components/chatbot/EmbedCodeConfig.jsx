import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { AlertCircle, Check, Code, Copy, Save } from 'lucide-react'
import { Button } from '../ui/button'

const EmbedCodeConfig = ({ chatBotId }) => {
    const [codeCopy, setCodeCopy] = useState(false)
    const handleCopyCode = () => {
        setCodeCopy(true)
        navigator.clipboard.writeText(`<script src="http://localhost:5173/widgest.js" data-id="${chatBotId}" defer></script>`)
        setTimeout(() => {
            setCodeCopy(false)
        }, 2000)
    }
    return (
        <Card className="border-white/10 bg-[#0A0A0E]">
            <CardHeader className="pb-3">
                <div className='flex items-center gap-3'>
                    <Code className='w-4 h-4 text-zinc-500' />
                    <CardTitle className="text-sm font-medium text-white uppercase">Apperance</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className='relative group' >
                    <div className='bg-[#050509] border border-white/10 rounded-lg p-3 overflow-hidden'>
                        <code className='text-sm text-zinc-400 font-mono block overflow-auto w-full'>
                            <div className='flex flex-col'>
                                <span>{`<script src="http://localhost:5173/widgest.js"`}</span>
                                <span>{`data-id="${chatBotId}" defer>`}</span>
                                <span>{`</script>`}</span>
                            </div>
                        </code>
                    </div>
                    <Button size='icon' onClick={handleCopyCode} variant='secondary' className="absolute top-2 right-2 h-8 w-8 bg-white/60 ">
                        {codeCopy ? (<Check className='w-4 h-4' />) : (<Copy className='w-4 h-4' />)}
                    </Button>
                </div>
                <div className='flex items-start gap-2 text-xs text-amber-500/80 bg-amber-500/10 p-2 rounded-xl'>
                    <AlertCircle className='w-4 h-4 shrink-0 mt-0.5' />
                    paste this code before the closing &lt;/head&gt; tag on your website.

                </div>
            </CardContent>
        </Card >
    )
}

export default EmbedCodeConfig