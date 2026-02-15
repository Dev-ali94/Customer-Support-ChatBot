import { cookies } from "next/headers";

export const metadata = {
    title: "Dashboard for ChatBot.Ai",
    description: "This is the environment given by chatbot.ai cummunity for work",
};


export default async function DashBoardLayout({ children }) {

    return (
        <div className="bg-[#050509] min-h-screen font-sans antialiased text-zinc-400 selection:bg-zinc-800 flex ">
            {children}
        </div>
    );
}
