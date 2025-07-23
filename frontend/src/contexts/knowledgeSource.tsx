import { createContext } from "react";

type KnowledgeSourceContextType = [

    string[],
    React.Dispatch<React.SetStateAction<string[]>>
    
]

export const KnowledgeSourceContext = createContext<KnowledgeSourceContextType>([["", ""], ()=>{}]);