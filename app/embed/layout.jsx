import React from 'react'

const layout = ({ children }) => {
    return (
        <div className="bg-[#050509] min-h-screen overflow-hidden flex flex-col antialiased text-zinc-100 selection:bg-zinc-800 font-sans">
            {children}
        </div>
    )
}

export default layout