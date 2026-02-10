import React from 'react'

const Integration = () => {
    return (
        <section id='integration' className='py-32 px-6 max-w-6xl mx-auto text-start' >
            <div className='max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16'>
                <div className='flex-1'>
                    <div className="mb-10">
                        <h2 className="text-2xl md:text-5xl font-medium text-white tracking-tight mb-6 text-start">
                            How to integrate?
                        </h2>
                        <p className="text-xl text-zinc-500 font-light max-w-xl text-start leading-relaxed">
                            No complex SDKs or user syncing required. Just add your script tag and you are live.
                            We inherit your CSS variables automatically.
                        </p>
                    </div>
                    <div className='flex flex-col gap-2  '>
                        <div className='flex items-center gap-4 text-sm text-zinc-300 font-light'>
                            <div className='w-6 h-6 rounded-full bg-zinc-900  border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-500'>1</div>
                            Scan your document url.
                        </div>
                        <div className='w-px h-4 bg-zinc-800 ml-3' />
                        <div className='flex items-center gap-4 text-sm text-zinc-300 font-light'>
                            <div className='w-6 h-6 rounded-full bg-zinc-900  border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-500'>2</div>
                            Copy the embed script.
                        </div>
                        <div className='w-px h-4 bg-zinc-800 ml-3' />
                        <div className='flex items-center gap-4 text-sm  text-zinc-300 font-light'>
                            <div className='w-6 h-6 rounded-full bg-zinc-900  border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-500'>3</div>
                            Auto-resolve tickets.
                        </div>
                    </div>

                </div>
                <div className="flex-1 max-w-lg w-full">
                    <div className="glass-card rounded-xl p-6 relative">
                        {/* Top bar */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex gap-2">
                                <span className="w-3 h-3 rounded-full bg-yellow-400/30 border border-yellow-400/50" />
                                <span className="w-3 h-3 rounded-full bg-red-400/30 border border-red-400/50" />
                                <span className="w-3 h-3 rounded-full bg-green-400/30 border border-green-400/50" />
                            </div>
                            <span className="text-xs text-zinc-500 font-mono">index.html</span>
                        </div>

                        {/* Code */}
                        <div className="font-mono text-xs md:text-sm leading-relaxed space-y-1">
                            <div className="text-zinc-500">
                                &lt; !--- ChatBot.Ai --- &gt;
                            </div>
                            <div>
                                <div>&lt;<span className="text-pink-500">script</span></div>
                                <div className='pl-4'>
                                    <span className="text-indigo-400">src</span>
                                    <span className="text-emerald-400">
                                        &quot; https://ali-imran-sheikh-portfolio.vercel.app &quot;
                                    </span>
                                </div>
                                <div className='pl-4'>
                                    <span className='text-indigo-400'>data-id</span>
                                    <span className="text-emerald-400">
                                        &quot; aghl5nm6nk-auvw2ui5jk-uim4lh6jbw &quot;
                                    </span>
                                </div>
                                <div className='pl-4'>
                                    <span className='text-indigo-400'>defer</span>&gt;
                                </div>
                                <div>&lt;/<span className="text-pink-500">script</span>&gt;</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section >
    )
}

export default Integration