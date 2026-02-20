import { Badge } from "@/components/ui/badge";
import agent_icon from "./robot.jpg"

export const assets = {
    agent_icon
}


export const getToneBadge = (tone) => {
    switch (tone) {
        case "strict":
            return <Badge variant="outline" className="border-red-500/20 text-red-500 shadow-none">strict</Badge>;
        case "neutral":
            return <Badge variant="outline" className="border-blue-500/20 text-blue-500 shadow-none">neutral</Badge>;
        case "friendly":
            return <Badge variant="outline" className="border-indigo-500/20 text-indigo-500 shadow-none">friendly</Badge>;
        case "empathetic":
            return <Badge variant="outline" className="border-purple-500/20 text-purple-500 shadow-none">empathetic</Badge>;
        default:
            return null;
    }
}